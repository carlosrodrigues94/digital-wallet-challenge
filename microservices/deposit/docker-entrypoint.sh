#!/bin/sh

npm install && \
npm run knex migrate:latest && \
npm run start:dev 