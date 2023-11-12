# Deploy Peerprep app to the cloud and set up the Continuous Deployment pipeline for cloud deployment.

## Overview

The app is deployed at https://peerprep.yuanzheng.pro/. 

The deployment of the app is separated into the angular frontend and microservice backend and handled separately. The frotnend deployment is handled by Vercel, while the backend deployment is handled by Google Kubernetes Engine (GKE).

## Domain resolution and safety:

The domain name is resolved by Cloudflare DNS. 

The frontend address https://peerprep.yuanzheng.pro/ is proxied through Cloudflare to leverage it to optimize, cache, and protect all requests to the application, as well as to protect the server from DDoS attacks.

The address to the backend api is https://peerprepapi.yuanzheng.pro/user/helloworld (check it out at https://peerprepapi.yuanzheng.pro/user/helloworld). Cloudflare also provides the DNS for the backend address.

The TLS certificates for the frontend and backend are provided by their cloud deployment services respectively. The Cloudflare SSL/TLS encryption mode is configured to Full, hence allowing it to provide end-to-end encryption for any traffic that is proxied through its network.

## Frontend:

### Configurations

The angular frontend is hosted on vercel, and deployment is configured to target the `./frontend` directory of the `deployment` branch.

### Continuous Deployment 

Vercel watches target branch for new commits that are pushed or merged, and automatically builds and deploys whenever a change is made.

## Backend:

### Configurations

The backend is hosted on Google Kubernetes Engine (GKE). All of the backend services are containerised using Docker, and deployed onto a GKE cluster, with the api-gateway service acting as the reverse proxy to direct external traffic to the relevant micro-service.

The ingress to the cluster is served by an External HTTP(S) Load Balancer. The load balancer directs all incoming traffic to the api-gateway service.

### Continuous Deployment 

Github actions watchs the respective `./backend` directories of the `master` branch of the main repository for changes, and triggers automatically upon change.
The github actions workdflow is as such:
- Build the docker image of the backend service.
- Built images are pushed to Google Artifact Registary twice: once tagged with the commit hash, and once tagged `latest`.
- `kubectl` buids the k8s deployment and service using the `<service>-deployment.yaml` and `<service>-service.yaml` files under `./gke/<service name>-service`.