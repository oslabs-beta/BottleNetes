To build the docker images and push them to the docker hub.

1. Login to the docker hub, if you are not already logged in. Then create a builder instance.

```bash
docker login
docker buildx create --name demo-app-builder
docker buildx use demo-app-builder
```

2. Build and push the docker image for the frontend service.

```bash
docker buildx build \
 --platform linux/amd64,linux/arm64,linux/arm/v7 \
 -f Dockerfile.frontend \
 -t randomlettergenerator/demo-app-on-bottlenetes-frontend:v0.1 \
 --push \
 .
```

3. Build and push the docker image for the backend service.

```bash
docker buildx build \
 --platform linux/amd64,linux/arm64,linux/arm/v7 \
 -f Dockerfile.backend \
 -t randomlettergenerator/demo-app-on-bottlenetes-backend:v0.1 \
 --push \
 .
```
