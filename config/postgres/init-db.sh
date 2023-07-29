#!/bin/bash

set -ex

sleep 3

echo "Creating databases for ENV: $POSTGRES_DB $POSTGRES_USER $POSTGRES_PASSWORD"

# Create multiple databases using psql
psql -v ON_ERROR_STOP=1 --dbname "$POSTGRES_DB" --username "$POSTGRES_USER" --password "$POSTGRES_PASSWORD" <<-EOSQL
    CREATE DATABASE postgres;
    CREATE DATABASE withdraw;
    CREATE DATABASE deposit;
    CREATE DATABASE statement_processor;
    CREATE DATABASE statement_consult;
EOSQL