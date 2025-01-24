# Docker
- Docker provides an efficient way to package, deploy, and run applications consistently and reducing "it works on my machine" problems.
## Hierarchy
```txt
Dockerfile --> Image --> Container: a running instance of an image
                           |--> Volumes (Data persistence)
                           |--> Networks (Communication)

Docker Compose: Manages multi-container applications
                          |--> Services (define container behavior)
                          |--> Networks & Volumes

Docker Swarm: Orchestrates container clusters
                          |--> Services
                          |--> Tasks (individual container instances)
                          |--> Load Balancing & Fault Tolerance

Kubernetes: Manages large-scale container deployments
                          |--> Pods (group of containers)
                          |--> Services & Persistent Storage
                          |--> Networking & Scaling
```
- A `Dockerfile` is the starting point in Docker, a text file that defines the instructions for building a Docker image. It includes steps like specifying the base image, copying files, installing dependencies, and setting the command for running the application.
- Executing a `Dockerfile` (with the `docker build` command) creates a Docker image. Images are immutable, versioned, and reusable across environments.
- Using a `docker-compose.yml` file, we can define services, networks, and volumes for multiple containers. For example, you can have an application container, a database container, and link them seamlessly.
