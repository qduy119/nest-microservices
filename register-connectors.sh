#!/bin/bash

# Register Debezium Postgres Source Connector
curl -X POST http://localhost:8083/connectors \
  -H "Content-Type: application/json" \
  -d @debezium-postgres.json

# Register Elasticsearch Sink Connector
curl -X POST http://localhost:8083/connectors \
  -H "Content-Type: application/json" \
  -d @elasticsearch-sink.json
