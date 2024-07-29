#!/bin/bash

# Define the docker-compose file location
DOCKER_COMPOSE_FILE="docker/docker-compose.yml"

# Define MySQL container name
MYSQL_CONTAINER_NAME="mysql"

# Define path to MySQL configuration file
MYSQL_CONFIG_FILE="/config/config.cnf"

# Define databases to create
DATABASES=("auth_db" "products_db" "orders_db")

# Start the Docker containers
echo "Starting Docker containers..."
docker-compose -f $DOCKER_COMPOSE_FILE up -d

# Wait for a few seconds to ensure MySQL is up and running
echo "Waiting for MySQL container to start..."
sleep 10

# Check if MySQL container is running
if [ "$(docker inspect -f '{{.State.Running}}' $MYSQL_CONTAINER_NAME)" == "true" ]; then
  echo "MySQL container is running. Proceeding to create databases..."
  
  # Loop through the databases array and create each database
  for DB in "${DATABASES[@]}"; do
    echo "Creating database: $DB"
    docker exec -i $MYSQL_CONTAINER_NAME mysql --defaults-extra-file=$MYSQL_CONFIG_FILE -e "CREATE DATABASE IF NOT EXISTS $DB;"
  done

  echo "All databases created successfully."
else
  echo "MySQL container is not running. Exiting..."
  exit 1
fi
