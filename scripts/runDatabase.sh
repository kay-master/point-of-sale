#!/bin/bash

# Define MySQL container name
MYSQL_CONTAINER_NAME="mysql"

# Define path to MySQL configuration file in the container
MYSQL_CONFIG_FILE="/config/config.cnf"

# Ensure mysql config file exists
# if [ ! -f "$MYSQL_CONFIG_FILE" ]; then
#     echo "Error: MySQL config file '$MYSQL_CONFIG_FILE' not found."
#     exit 1
# fi

# Define databases to create
DATABASES=("auth_db" "products_db" "orders_db")

# Wait for a few seconds to ensure MySQL is up and running
echo "Waiting for MySQL container to start..."
sleep 5

# Check if MySQL container is running
if [ "$(docker inspect -f '{{.State.Running}}' $MYSQL_CONTAINER_NAME)" == "true" ]; then
  echo "MySQL container is running. Proceeding to create databases..."
  
  # Loop through the databases array and create each database
  for DB in "${DATABASES[@]}"; do
    echo "Creating database: $DB"
    docker exec -i $MYSQL_CONTAINER_NAME mysql --defaults-extra-file=$MYSQL_CONFIG_FILE -e "CREATE DATABASE IF NOT EXISTS $DB;"
    if [ $? -ne 0 ]; then
      exit 1
    fi
  done

  echo "All databases created successfully."

  # Run migrations for all services
  echo "Running migrations for all services..."
  pnpm run migrate:services

  if [ $? -ne 0 ]; then
    echo "Failed to run migrations. Please check the error messages."
    exit 1
  fi

  # Run seed scripts for all services
  echo "Running seed scripts for all services..."
  pnpm run seed:services

  if [ $? -ne 0 ]; then
    echo "Failed to run seed scripts. Please check the error messages."
    exit 1
  fi

  echo "Migrations and seeds completed successfully."
else
  echo "MySQL container is not running. Please run './docker/runDocker.sh' script to start MYSQL server :-)"
  exit 1
fi
