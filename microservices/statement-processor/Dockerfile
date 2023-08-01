FROM --platform=linux/amd64 node:18-alpine AS development

WORKDIR /app/statement-processor

RUN apk update && \
    apk add wget && \
    wget -q -O /usr/bin/wait-for https://raw.githubusercontent.com/eficode/wait-for/v2.2.3/wait-for && \
    chmod +x /usr/bin/wait-for

COPY microservices/statement-processor .

RUN ["chmod", "+x", "./docker-entrypoint.sh"]

USER node

ENTRYPOINT ["./docker-entrypoint.sh"]