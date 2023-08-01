# Running Project

- To run the project in development mode, run the following commands:

```bash

  # Ensure that you have a docker network called "microservices_network" created
  # If not, run the following command:
  $ docker network create microservices_network --driver bridge

  # Run the following command to start the project
  $ docker compose up

```

# Startup Info

<pre align="start">
  After docker compose up command starts, the docker-compose.yml file will start the following containers:
  
  - krakend_ce
  - swagger_ui
  - statement_consult_api
  - statement_processor_api
  - withdraw_api
  - deposit_api
  - database
  - redis
  - rabbitmq

The automation of containers it will create a database for each microservice, install dependencies, run migrations and deal with de database connection.

The applications also are ready to deal with retry of connections with RabbitMQ

</pre>

# Running Tests

```bash

  # With the containers running, you can run the script for e2e tests
  $ ./scripts/run-e2e-tests.sh

  # You can also run the script for unit tests (The containers don't need to be running)
  $ ./scripts/run-unit-tests.sh

  # NOTE: If you suffer with permission problems, you can run the following command to the affected script:
  $ chmod +x ./scripts/run-e2e-tests.sh

  # or

  $ chmod +x ./scripts/run-unit-tests.sh

```

# Architecture

<pre align="start">
The project is based on the microservices architecture, where each microservice has its own database and is responsible for a specific business rules, the communication between the microservices is made by the RabbitMQ message broker with a Event Driven Architecture.
Some concepts used:

- DDD
- Responsibility segregation
- SOLID
- Dependency inversion
- Dependency injection

</pre>

# Technologies

- [Node.js](https://nodejs.org/en/)
- [Nest.js](https://nestjs.com/)
- [Docker](https://www.docker.com/)
- [KrakenD](https://www.krakend.io/)
- [Redis](https://redis.io/)
- [RabbitMQ](https://www.rabbitmq.com/)
- [PostgreSQL](https://www.postgresql.org/)

# Documentation

<pre align="start">
- [Swagger](https://swagger.io/)

The comunication with the app works only throught the api gateway.
The application port is 8080.
Swagger UI port is 8081.
I also add a insomnia collection to help you test the api.

</pre>

# Disclaimer

<pre align="start">

1 - On my design i was considering implement more 3 services, Shop, Cancel and Value-Reversal but i didn't have time to implement them.
2 - I suffered with a bug with swagger ui that cannot mount the curl command to test the api, the problem occurs with properties that are number, for example the amount, i tried to fix it but i didn't found any solution for it.

</pre>

# Thanks

<p>
Hope you enjoy my project, i'm open to feedbacks and suggestions. Thank you!
</p>
