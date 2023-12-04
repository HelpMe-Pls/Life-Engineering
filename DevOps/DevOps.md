# AWS
## Migrations
- Relocate
- **Rehost**

### Modernization
- **Replatform**
- Repurchase
- **Refactor**: AWS Transit Gateway redirecting traffics from env to their  corresponding platform (monolith - microservice)
- Adopt loosely coupled services with event driven tools to replace traditional arch

### Scaling
- VMs >> (**MGN**: Staging >> Live)
- Migrate db: using DMS

## Event Driven Architect
- Event stores
- Event routers

### Amazon SQS
- Self healing
- Standard and FIFO queues

### Amazon SNS
- Pub/Sub service (1-many)

### Service Bus (event broker) - Event Bridge
- A centralized Handlers for Many-many routing between microservices
- Serverless
- Create filtering rules