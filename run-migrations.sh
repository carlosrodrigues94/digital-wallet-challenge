#!/bin/bash

microservices=("statement-processor:statement_processor_api" "statement-consult:statement_consult_api" "deposit:deposit_api" "withdraw:withdraw_api")

run_migrations() {
  echo "Running migrations for $1 (Container: $2)"
  docker exec -it "$2" npm run knex migrate:latest
}

for microservice in "${microservices[@]}"; do
  IFS=":" read -ra parts <<< "$microservice"
  ms_name="${parts[0]}"
  container_name="${parts[1]}"
  
  run_migrations "$ms_name" "$container_name"
done