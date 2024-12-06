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

1. Under the root directory of the project folder, create 1 Dockerfile each for Frontend and Backend

__The following format is based on a project using Vite and React__

_CMD can vary depend on your __package.json__ file_

```Dockerfile
// frontend.dockerfile

FROM node:23.3.0
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

```Dockerfile
// backend.dockerfile

FROM node:23.3.0
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "server"]
```

- Make sure the node version is listed on the dockerhub image list
- Make sure the commands in CMD are the commands we want to run for the app

2. Create a file ".dockerignore" with the following content:

```Dockerignore
node_modules
.git
.env
dist
logs
```

3. Build the docker images by running the following command in the terminal:

```
docker buildx build -t backend:latest -f backend.dockerfile .
docker buildx build -t frontend:latest -f frontend.dockerfile .
```

4. Push the docker images to DockerHub by running the following command in the terminal:

```
// Tag and push backend image

docker tag backend:latest <your-registry>/backend:latest
docker push <your-registry>/backend:latest


// Tag and push frontend image

docker tag frontend:latest <your-registry>/frontend:latest
docker push <your-registry>/frontend:latest
```

## Create a k8s cluster using *minikube* and contain an Application

1. Start the minikube by running the following command in the terminal:

```
minikube start
```

2.  Create a Secret using *.env* file:

```
kubectl create secret generic <secret-name> --from-env-file=.env 
```

3.  Under the root directory of the project folder, create a YAML file for your Backend Deployment and Services with the following format:

```YAML
// backend.yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: <your-registry>/backend
        resources: 
          limits:
            memory: "128Mi"
            cpu: "500m"
        ports:
        - containerPort: 3000
        envFrom:
        - secretRef:
            name: app-secret
---
apiVersion: v1
kind: Service
metadata:
  name: backend
spec:
  selector:
    app: backend
  ports:
  - protocol: TCP
    port: 3000
    targetPort: 3000
```
- Make sure *selector > app* in Service matches *template > metadata > labels > app*
- Make sure the image matches the image in the DockerHub
- Make sure *targetPort* in Service matches with *containerPort* in Deployment and *EXPOSE* in *backend.dockerfile*
- Number of replicas can be adjusted, it represents the number of pods running the app. Some of these pods are used for load balancing and failover. All of these pods are the same size and have the same configuration.
- Adjust resources if pods fail to run with the *OOMKilled* status
- *ENV* is used by referred to the secret name. In this case it is *app-secret*

4.  Do the same with Frontend, using the following format:

```YAML
// frontend.yaml

apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: <your-registry>/frontend
        resources:
          limits:
            memory: "128Mi"
            cpu: "500m"
        ports:
        - containerPort: 80
        env:
        - name: BACKEND_URL
          value: "http://backend:3000"
---
apiVersion: v1
kind: Service
metadata:
  name: frontend
spec:
  selector:
    app: frontend
  type: NodePort
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
```
- Frontend is connected to Backend using *ENV* and referred to the *PORT* that Backend is running.

5.  Run the deployment by running the following command in the terminal:

```
kubectl apply -f deployment.yaml
```

6.  After a few seconds, check the pod status by running the following command in the terminal:

```
kubectl get pod
```

- If you can see the pods running, the deployment was successful.
- If the pods status is "ImagePullBackOff", it means the image is not found. Make sure the image name in the yaml files match the image name in the DockerHub.
- If the pods status is "CrashLoopBackOff", it means the app is crashing. Check the logs of the pod by running the following command in the terminal:

```
kubectl logs pod-name
```

7.  Check the service status by running the following command in the terminal:

```
kubectl get svc
```

8.  Make sure your frontend Service has endpoint IP address:
```
kubectl describe <frontend-service>
```

9.  Make sure frontend pods has the same IP address as the frontend Service endpoint:
```
kubectl get pod -o wide
```

10.  Open the app by running the following command in the terminal:

```
minikube service <frontend-service>
```

11.  If the app is full stack and properly configured, you should be able to see the app running in the browser.  
     You can also check the cluster's status in the docker desktop app.  
     All of the contents previously displayed in the terminal (such as backend console logs) now will be displayed in the "Logs" tab of the docker desktop app.

## Fetch the metrics of the k8s cluster

1.  install the Prometheus-operator by running the following commands in the terminal:

```
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add stable https://charts.helm.sh/stable
helm repo update
helm install prometheus prometheus-community/kube-prometheus-stack
```

2.  After the Prometheus-operator is installed, run the following command to port-forward the Prometheus pod to a localhost port, in this case, port 9090:

```
kubectl port-forward prometheus-prometheus-kube-prometheus-prometheus-0 9090
```

3.  Open the browser and go to "localhost:9090" to access the Prometheus dashboard.
4.  Now you can run the PromQL queries in the Prometheus dashboard to fetch the metrics of the k8s cluster.  
    Please refer to:  
    - https://promlabs.com/promql-cheat-sheet/  
    - https://github.com/ruanbekker/cheatsheets/blob/master/prometheus/README.md  
    - https://signoz.io/guides/promql-cheat-sheet/  
    - https://last9.io/blog/promql-cheat-sheet/  