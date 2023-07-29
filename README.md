# Running Project

- To run the project in development mode, run the following commands:

```bash

  # Ensure that you have a docker network called "microservices_network" created
  # If not, run the following command:
  $ docker network create microservices_network --driver bridge

  # Give permission to script to create databases for each microservice
  # This script it will me executed automatically with docker-compose
  $ chmod +x ./config/postgres/init-db.sh

  # Run the following command to start the project
  $ docker compose up

  # Run the following command to give the script permission to run
  $ chmod +x ./run-migrations.sh

  # Run the following command to run the migrations
  $ ./run-migrations.sh

```

# Technologies

- [Node.js](https://nodejs.org/en/)
- [Nest.js](https://nestjs.com/)
- [KrakenD](https://www.krakend.io/)
- [RabbitMQ](https://www.rabbitmq.com/)
- [PostgreSQL](https://www.postgresql.org/)
