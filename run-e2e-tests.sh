#!/bin/bash

microservices=("deposit:deposit_api" "withdraw:withdraw_api" "statement-consult:statement_consult_api")

run_tests() {
  echo "Running End to End Tests for $1 (Container: $2)"
  docker exec -it "$2" npm run test:e2e
}

for microservice in "${microservices[@]}"; do
  IFS=":" read -ra parts <<< "$microservice"
  ms_name="${parts[0]}"
  container_name="${parts[1]}"
  
  run_tests "$ms_name" "$container_name"
done