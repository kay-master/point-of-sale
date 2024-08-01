#!/bin/bash

# Function to display usage information
usage() {
    echo "Usage: $0 {dev|prod} {up|down} [--build] [-d]"
    exit 1
}

# Ensure the correct number of arguments are provided
if [ "$#" -lt 2 ]; then
    usage
fi

# Define environment and action based on the arguments
ENV=$1
ACTION=$2

# Shift the first two arguments so we can pass the remaining arguments to docker-compose
shift 2

# Define the base and environment-specific compose files
BASE_COMPOSE_FILE="docker/docker-compose.yml"
ENV_COMPOSE_FILE="docker/docker-compose.$ENV.yml"

# Ensure the environment-specific compose file exists
if [ ! -f "$ENV_COMPOSE_FILE" ]; then
    echo "Error: Environment-specific compose file '$ENV_COMPOSE_FILE' not found."
    exit 1
fi

# Create external networks if they don't exist
docker network inspect mysqlnetwork >/dev/null 2>&1 || docker network create --driver bridge mysqlnetwork
docker network inspect consulnetwork >/dev/null 2>&1 || docker network create --driver bridge consulnetwork

# Run the docker-compose command with the appropriate files and arguments
docker-compose -f "$BASE_COMPOSE_FILE" -f "$ENV_COMPOSE_FILE" "$ACTION" "$@"
