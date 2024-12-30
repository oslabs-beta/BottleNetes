## Install istio

1. download istio by running the following command

```bash
curl -L https://istio.io/downloadIstio | sh -
```

2. add istio to your environment path by running the following command

```bash
export PATH=$PWD/istio-1.24.1/bin:$PATH
```

- make sure the version number matches the one you downloaded

3. install the istio

```bash
istioctl install --set profile=demo -y
```

- here, we are using the demo profile, which is suitable for learning and includes add-ons like Prometheus and Grafana.

4. Enable the automatic sidecar injection by istio by running the following command

```bash
kubectl label namespace default istio-injection=enabled --overwrite=true
```

- here, we enable the automatic sidecar injection in the default namespace (usually this is the one we use for our deployment unless otherwise specified).

5. Re-apply the deployment yaml file:

```bash
kubectl apply -f deployment.yaml
```

6. Verify if all working pods have the Istio sidecar (istio-proxy) injected by running the following command

```bash
kubectl get pods
```

- For each working node, under the "READY" column, you should see two containers running (i.e. 2/2).
  One is your application container, and the other is the Istio sidecar container.

## Configure the Prometheus to scrape metrics from the Istio sidecar

1. Create a new file for service monitor, maybe call it istio-servicemonitor.yaml:

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: istio-service-monitor
  namespace: default
  labels:
    release: prometheus
spec:
  selector:
    matchLabels:
      app: istiod
  namespaceSelector:
    matchNames:
      - istio-system
  endpoints:
    - interval: 10s
      path: /metrics
      port: http-monitoring
---
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: istio-sidecar-servicemonitor
  namespace: default
  labels:
    release: prometheus
spec:
  selector:
    matchLabels:
      istio-prometheus-scrape: "true"
  namespaceSelector:
    any: true
  endpoints:
    - port: http-envoy-prom
      path: /metrics
      interval: 10s
      scheme: http
```

- The first half is for istio to monitor the control plane
- The second half is for istio to monitor the worker pods (injected sidecars).

2. Update the deployment yaml file to add a service to select the pods.
   The updated deployment yaml file should look like this:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: grad-assessment-app-b
spec:
  replicas: 3
  selector:
    matchLabels:
      app: grad-assessment-app-b
  template:
    metadata:
      labels:
        app: grad-assessment-app-b
    spec:
      containers:
        - name: grad-assessment-app-b
          image: randomlettergenerator/test-docker-app
          imagePullPolicy: Always
          resources:
            requests:
              memory: "64Mi"
              cpu: "250m"
            limits:
              memory: "128Mi"
              cpu: "500m"
          ports:
            - containerPort: 3333
---
apiVersion: v1
kind: Service
metadata:
  name: grad-assessment-app-b
spec:
  type: NodePort
  selector:
    app: grad-assessment-app-b
  ports:
    - port: 3333
      targetPort: 3333
      nodePort: 30080
---
apiVersion: v1
kind: Service
metadata:
  name: grad-assessment-app-b-metrics
  namespace: default
  labels:
    istio-prometheus-scrape: "true"
spec:
  selector:
    app: grad-assessment-app-b
  ports:
    - name: http-envoy-prom
      port: 15020
      targetPort: 15020
```

- We added a new second service called `grad-assessment-app-b-metrics` with the selector: app: grad-assessment-app-b, i.e. this service will
  only target those worker pods that's running the app.
- We also added a label `istio-prometheus-scrape: 'true'` to indicate that this service should be scraped by Prometheus and istio.
- port 15020: Merged Prometheus telemetry from Istio agent, Envoy, and application (according to istio documentation).

3. Apply the service monitor yaml file and deployment yaml file:

```bash
kubectl apply -f istio-servicemonitor.yaml
kubectl apply -f deployment.yaml
```

4. Label all pods to indicate that they should be scraped by Prometheus:

```bash
kubectl label pods --all istio-prometheus-scrape=true
```

5. Verify if the istio service monitor is working by checking the Prometheus dashboard:

   a. Port forward the Prometheus to port 9090 (or any other port you prefer):

   ```bash
   kubectl port-forward prometheus-prometheus-kube-prometheus-prometheus-0 9090
   ```

- keep this terminal open and running while we check the Prometheus dashboard.
  b. Then, open your browser and go to http://localhost:9090. You should see the Prometheus dashboard.
  c. Go to the "Status" tab and click on "Targets". Click on "All Scrape Tools" dropdown, you should be able to
  see the istio service monitor targets. Make sure the status is green "UP".

6. If you do not see the istio in targets, maybe try deleting all pods from the cluster (kubernetes will recreate them) and reapply the service monitor yaml file.
   ```bash
   kubectl delete pods --all
   ```

## Generate some fake external traffic to test the latency metrics

1. Create a yaml file for gateway, using Istio's built-in ingress gateway, to expose the service to the outside world. Maybe call it gateway.yaml:

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: Gateway
metadata:
  name: grad-assessment-gateway
  namespace: default
spec:
  selector:
    istio: ingressgateway
  servers:
    - port:
        number: 80
        name: http
        protocol: HTTP
      hosts:
        - "*"
```

2. Create a yaml file for the virtual service, maybe call it virtualservice.yaml:

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: grad-assessment-virtualservice
  namespace: default
spec:
  hosts:
    - "*"
  gateways:
    - grad-assessment-gateway
  http:
    - match:
        - uri:
            prefix: "/"
      route:
        - destination:
            host: grad-assessment-app-b
            port:
              number: 3333
```

3. Apply both gateway and virtual service yaml files:

```bash
kubectl apply -f gateway.yaml
kubectl apply -f virtualservice.yaml
```

4. Port forward local port 8081 to port 80 on the istio ingress gateway service.

```bash
kubectl port-forward svc/istio-ingressgateway -n istio-system 8081:80
```

- keep this terminal open and running while we generate fake external traffic.
- Now, if we send a request to localhost:8081, it would be forwarded to the istio ingress gateway service running on port 80,
  which in turn will forward the request to the worker pod inside the k8s cluster.

5. Test the gateway by running the following command in another terminal:

```bash
curl -v http://localhost:8081/
```

- You should see the response from the worker pod.

  5.5. (optional). If you want to get into the pod and run some commands, you can do the following:

  a. Get the pod name by running the following command:

  ```bash
  kubectl get pods
  ```

  b. Since in our case, each pod would have two containers (one for the application and the other for the istio sidecar), we need to specify the container name as well.
  First, let's get the container name inside the pod by running the following command:

  ```bash
      kubectl get pod grad-assessment-app-b-7f9858b599-58v6l -n default -o jsonpath='{.spec.containers[*].name}'
  ```

  - here, the pod name is `grad-assessment-app-b-7f9858b599-58v6l`. Replace it with your pod name.
  - you would get some output like

    ```bash
    grad-assessment-app-b istio-proxy
    ```

    the first one is the name for the application container.

    c. Now, you can get into the app container in worker pod by running the following command:

    ```bash
    kubectl exec -it grad-assessment-app-b-7f9858b599-58v6l -n default -c grad-assessment-app-b -- /bin/sh
    ```

    - here, the pod name is `grad-assessment-app-b-7f9858b599-58v6l`. Replace it with your pod name.
    - the container name is `grad-assessment-app-b`. Replace it with your container name.

    d. Now, you are inside the container. You can run any command you want with the application (just like you would in a normal terminal).
    Test the application, make sure it is working as expected. For example, you can run the following command to test the "/" endpoint of the application:":

    ```bash
    curl -v http://grad-assessment-app-b.default.svc.cluster.local:3333/
    ```

    - replace the application name ("grad-assessment-app-b") and the port with yours accordingly.

6. Now, let's generate some fake external traffic to test the latency metrics.

   ```bash
   for i in {1..50}; do curl http://localhost:8081/
   ```

   - This command will send 50 same requests to the localhost:8081. You can change the number of requests as you like.
   - To the pod's point of view, these requests are coming from the outside world (external to the k8s cluster), even though we only send them from our terminal.

## Check the latency metrics in Prometheus

1. Open your browser and go to http://localhost:9090 to access the Prometheus dashboard.
2. Some of the available istio metrics (at least these are all I could found that are related to latency) are:
   - istio_agent_go_gc_duration_seconds
   - istio_agent_go_gc_duration_seconds_sum
   - istio_agent_go_gc_duration_seconds_count
   - istio_agent_startup_duration_seconds
   - istio_request_duration_milliseconds_bucket
   - istio_request_duration_milliseconds_sum
   - istio_request_duration_milliseconds_count
     The first three are related to the garbage collection of the istio agent.
     The last three are related to the request duration and count.
3. Some potential queries to check the latency metrics are:

a. calculate the average latency per pod using the sum and count metrics.

For inbound traffic:

```sql
sum(rate(istio_request_duration_milliseconds_sum{reporter="destination"}[1h])) by (pod) /
sum(rate(istio_request_duration_milliseconds_count{reporter="destination"}[1h])) by (pod)
```

For outbound traffic:

```sql
sum(rate(istio_request_duration_milliseconds_sum{reporter="source"}[1h])) by (pod) /
sum(rate(istio_request_duration_milliseconds_count{reporter="source"}[1h])) by (pod)
```

For combined traffic (inbound + outbound) latency:

```sql
(
  sum(rate(istio_request_duration_milliseconds_sum{reporter="destination"}[1h])) by (pod) +
  sum(rate(istio_request_duration_milliseconds_sum{reporter="source"}[1h])) by (pod)
) / (
  sum(rate(istio_request_duration_milliseconds_count{reporter="destination"}[1h])) by (pod) +
  sum(rate(istio_request_duration_milliseconds_count{reporter="source"}[1h])) by (pod)
)
```

- sum(rate(istio_request_duration_milliseconds_sum{...}[1h])): Total request duration over the last 1 hr.
- sum(rate(istio_request_duration_milliseconds_count{...}[1h])): Total number of requests over the last 1 hr.

b. calculate the 99th percentile latency (i.e. peak latency) per pod.

```sql
histogram_quantile(
  0.99,
  sum(
    rate(
      istio_request_duration_milliseconds_bucket{reporter="destination"}[1h]
    )
  ) by (le, pod)
)
```

- We can replace the 0.99 with any other value (e.g. 0.50 for the median latency during that timewindwo).
- histogram_quantile(0.99, ...): Calculates the 99th percentile latency.
- sum(rate(...[1h])): Computes the rate of requests over the last 1 hr.
- istio_request_duration_milliseconds_bucket{reporter="destination"}: Filters to use metrics reported by the server-side proxy.

c. Total Number of Requests in the Last Hour:

- inbound traffic:

```sql
sum(increase(istio_request_duration_milliseconds_count{reporter="destination"}[1h])) by (pod)
```

- outbound traffic:

```sql
sum(increase(istio_request_duration_milliseconds_count{reporter="source"}[1h])) by (pod)
```

- inbound + outbound traffic:

```sql
sum(increase(istio_request_duration_milliseconds_count{reporter="destination"}[1h])) by (pod)
+
sum(increase(istio_request_duration_milliseconds_count{reporter="source"}[1h])) by (pod)
```

Notes:

- You may use shorter time range (e.g. 1m) for more responsive results. However, if the timewindow is too short (e.g. 1s), the results may not be available.
- The result will be in milliseconds.
- You may replace the "pod" with "destination_workload" to display the application workload name instead of the pod name.
