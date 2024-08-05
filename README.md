# Inter-service communication

To allow secure inter-service communication, we user Token-based Authentication, each service must have environment variable `SERVICE_COMMUNICATION_TOKEN`

Generate a secure token for service-to-service communication. To generate a secure token run:

```bash
./scripts/createServiceToken.sh
```

# Database creation and migrations

Run following script to create databases:

```bash
./script/run-database.sh
```

# Infrastructure

- **Consul**: Provides service discovery. It keeps track of which services are available and their health status.
- **nginx-proxy**: Acts as the gateway. It uses environment variables to configure itself dynamically to route traffic to the appropriate services.

To start the servers:

Example:

- `docker/runDocker.sh prod up --build -d`
- `docker/runDocker.sh dev up --build -d`
- `docker/runDocker.sh dev down`

```bash
docker/runDocker.sh prod up -d
```

1. order creation
2. order updates
3. low stock
