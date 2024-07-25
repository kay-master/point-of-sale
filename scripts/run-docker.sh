#!/bin/bash

# Define the network name
PUBLIC_NETWORK_NAME=external-proxy
PRIVATE_NETWORK_NAME=internal-proxy

# Check if the PUBLIC_NETWORK_NAME already exists
if [ ! "$(docker network ls | grep $PUBLIC_NETWORK_NAME)" ]; then
  echo "Creating Docker network: $PUBLIC_NETWORK_NAME"
  docker network create $PUBLIC_NETWORK_NAME
else
  echo "Docker network $PUBLIC_NETWORK_NAME already exists"
fi

# Check if the PRIVATE_NETWORK_NAME already exists
if [ ! "$(docker network ls | grep $PRIVATE_NETWORK_NAME)" ]; then
  echo "Creating Docker network: $PRIVATE_NETWORK_NAME"
  docker network create $PRIVATE_NETWORK_NAME
else
  echo "Docker network $PRIVATE_NETWORK_NAME already exists"
fi

# Build the base image
echo "Building base image clarityhr-base"
docker build -f Dockerfile.base -t clarityhr-base .

# Run Docker Compose
echo "Running Docker Compose"
docker-compose -f infrastructure/docker-compose-dev.yml up -d

# Check the status of the services
echo "Checking the status of the services"
docker-compose -f infrastructure/docker-compose-dev.yml ps
