# Inter-service communication

To allow secure inter-service communication, we user Token-based Authentication, each service must have environment variable `SERVICE_COMMUNICATION_TOKEN`

Generate a secure token for service-to-service communication. To generate a secure token run:

```bash
./scripts/createServiceToken.sh
```

# Infrastructure

- **Consul**: Provides service discovery. It keeps track of which services are available and their health status.
- **Registrator**: Automatically registers and deregisters services with Consul based on the state of the Docker containers.
- **nginx-proxy**: Acts as the gateway. It uses environment variables to configure itself dynamically to route traffic to the appropriate services.

To start microservices:

```bash
docker-compose -f docker/microservices/docker-compose.yml up -d
```

To your infrastructure services:

```bash
docker-compose -f docker/infrastructure/docker-compose.yml up -d
```
