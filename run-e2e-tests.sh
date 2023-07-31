#!/bin/bash

microservices=("deposit:deposit_api" "withdraw:withdraw_api")

run_migrations() {
  echo "Running End to End Tests for $1 (Container: $2)"
  docker exec -it "$2" npm run test:e2e
}

for microservice in "${microservices[@]}"; do
  IFS=":" read -ra parts <<< "$microservice"
  ms_name="${parts[0]}"
  container_name="${parts[1]}"
  
  run_migrations "$ms_name" "$container_name"
done