# Inter-service communication

To allow secure inter-service communication, we user Token-based Authentication, each service must have environment variable `SERVICE_COMMUNICATION_TOKEN`

Generate a secure token for service-to-service communication. To generate a secure token run:

```bash
./scripts/createServiceToken.sh
```
