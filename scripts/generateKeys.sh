#!/bin/bash

# Directory paths
AUTH_SERVICE_DIR="./services/auth-service/src/secrets"
SERVICES_DIR="./services"

# Create the secrets directory if it doesn't exist
mkdir -p "$AUTH_SERVICE_DIR"

# Generate a private key
openssl genrsa -out "$AUTH_SERVICE_DIR/private.pem" 2048
echo "Private key generated and saved in $AUTH_SERVICE_DIR/private.pem"

# Generate a public key from the private key
openssl rsa -in "$AUTH_SERVICE_DIR/private.pem" -outform PEM -pubout -out "$AUTH_SERVICE_DIR/public.pem"
echo "Public key generated and saved in $AUTH_SERVICE_DIR/public.pem"

# Function to copy the public key to each service's secrets directory
copy_public_key_to_service() {
    local service_dir=$1
    local secrets_dir="$service_dir/src/secrets"

    # Create the secrets directory if it doesn't exist
    mkdir -p "$secrets_dir"

    # Copy the public key to the secrets directory
    cp "$AUTH_SERVICE_DIR/public.pem" "$secrets_dir/public.pem"
    echo "Public key copied to $secrets_dir/public.pem"
}

# Find all service directories and copy the public key
find "$SERVICES_DIR" -mindepth 1 -maxdepth 1 -type d | while read -r service_dir; do
    # Skip the auth-service directory
    if [ "$(basename "$service_dir")" == "auth-service" ]; then
        continue
    fi
    copy_public_key_to_service "$service_dir"
done

echo "Public key copied to all services in $SERVICES_DIR"
