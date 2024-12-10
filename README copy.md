# Initial Setup Guide

## Prep work

1. Download the docker desktop
2. Install minikube, helm, and kubectl by running the following commands in the terminal:

```
brew install minikube
brew install kubectl
brew install helm
```

3. In VsCode, install the following extensions:

- Docker
- Kubernetes

## Containerize the app into a docker image

1. Under the root directory of the project folder, create a file "Dockerfile" with the following content:

```
FROM node:23.3.0
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "start"]
```

- Make sure the node version is listed on the dockerhub image list, and it matches with your installed node
- Make sure the commands in CMD are the commands we want to run for the app

2. Create a file ".dockerignore" with the following content:

```
node_modules
.git
.env
dist
logs
```

3. Build the docker image by running the following command in the terminal:

```
docker build -t nameOfDockerImage .
```

4. Push the docker image to dockerhub by running the following command in the terminal:

```
docker tag nameOfDockerImage yourDockerhubUsername/nameOfDockerImage
docker push yourDockerhubUsername/nameOfDockerImage
```

## Create a k8s cluster and run the app on it

1. Start the minikube by running the following command in the terminal:

```
minikube start
```

2.  Under the root directory of the project folder, create a file "deployment.yaml" with the following content:

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: name-of-your-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: name-of-your-app
  template:
    metadata:
      labels:
        app: name-of-your-app
    spec:
      containers:
        - name: name-of-your-app
          image: yourDockerhubUsername/nameOfDockerImage
          imagePullPolicy: Always
          resources:
            requests:
              memory: '64Mi'
              cpu: '250m'
            limits:
              memory: '128Mi'
              cpu: '500m'
          ports:
            - containerPort: 3333
---
apiVersion: v1
kind: Service
metadata:
  name: name-of-your-app
spec:
  type: NodePort
  selector:
    app: name-of-your-app
  ports:
    - port: 3333
      targetPort: 3333
      nodePort: 30080
```

- Make sure the app name in the deployment.yaml matches the name of the app
- Make sure the image matches the image in the dockerhub
- Make sure the ports match the ports in the app
- Number of replicas can be adjusted, it represents the number of pods running the app. Some of these pods are used for load balancing and failover. All of these pods are the same size and have the same configuration.

4. Run the deployment by running the following command in the terminal:

```
kubectl apply -f deployment.yaml
```

5. After a few seconds, check the pod status by running the following command in the terminal:

```
kubectl get pods
```

- If you can see the pods running, the deployment was successful.
- If the pods status is "ImagePullBackOff", it means the image is not found. Make sure the image name in the deployment.yaml matches the image name in the dockerhub.
- If the pods status is "CrashLoopBackOff", it means the app is crashing. Check the logs of the pod by running the following command in the terminal:

```
kubectl logs podName
```

6. Check the service status by running the following command in the terminal:

```
kubectl get services
```

7. Open the app by running the following command in the terminal:

```
minikube service grad-assessment-app-b
```

- Make sure the service name matches the service name in the deployment.yaml

8. If the app is full stack and properly configured, you should be able to see the app running in the browser.
   You can also check the cluster's status in the docker desktop app.
   All of the contents previously displayed in the terminal (such as backend console logs) now will be displayed in the "Logs" tab of the docker desktop app.

## Fetch the metries of the k8s cluster

1. install the Prometheus-operator by running the following commands in the terminal:

```
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add stable https://charts.helm.sh/stable
helm repo update
helm install prometheus prometheus-community/kube-prometheus-stack
```

2. After the Prometheus-operator is installed, run the following command to port-forward the Prometheus pod to a localhost port, in this case, port 9090:

```
kubectl port-forward prometheus-prometheus-kube-prometheus-prometheus-0 9090
```

3. Open the browser and go to "localhost:9090" to access the Prometheus dashboard.
4. Now you can run the PromQL queries in the Prometheus dashboard to fetch the metrics of the k8s cluster.
   Please refer to:
   https://promlabs.com/promql-cheat-sheet/
   https://github.com/ruanbekker/cheatsheets/blob/master/prometheus/README.md
   https://signoz.io/guides/promql-cheat-sheet/
   https://last9.io/blog/promql-cheat-sheet/
   test
