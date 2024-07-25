#!/bin/bash

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "Node.js is not installed. Please install Node.js to continue."
    exit 1
fi

# Check if the crypto module is available
if ! node -e "require('crypto')" &> /dev/null
then
    echo "Node.js crypto module is not available. Now running 'pnpm install' to install the required modules."

    # Installing modules using pnpm
    pnpm install
fi

# Generate a secure token
SERVICE_COMMUNICATION_TOKEN=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")

# Output the token to the console
echo -e "\n"
echo "Generated Service Communication Token:"
echo "$SERVICE_COMMUNICATION_TOKEN"

echo -e "\n"

# Directory containing your services
SERVICES_DIR="./services"

# Function to add the token to .env files
add_token_to_env() {
    local service_dir=$1
    local env_file="$service_dir/.env"
    local service_name=$(basename "$service_dir")

    # Skip the gateway-service directory
    # if [ "$service_name" == "gateway-service" ]; then
    #     echo "-> Skipping $service_name"
    #     return
    # fi

    # Check if .env file exists, create if it doesn't
    if [ ! -f "$env_file" ]; then
        touch "$env_file"
    fi

    # Add the token to the .env file if it doesn't already exist
    if ! grep -q "SERVICE_COMMUNICATION_TOKEN" "$env_file"; then
        echo "SERVICE_COMMUNICATION_TOKEN=$SERVICE_COMMUNICATION_TOKEN" >> "$env_file"
        echo "-> Token added to $env_file"
    else
        # Update the token if it already exists
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s/^SERVICE_COMMUNICATION_TOKEN=.*/SERVICE_COMMUNICATION_TOKEN=$SERVICE_COMMUNICATION_TOKEN/" "$env_file"
        else
            sed -i "s/^SERVICE_COMMUNICATION_TOKEN=.*/SERVICE_COMMUNICATION_TOKEN=$SERVICE_COMMUNICATION_TOKEN/" "$env_file"
        fi
        echo "-> Token updated in $env_file"
    fi
}

# Recursively find all service directories and add the token to .env files
find "$SERVICES_DIR" -mindepth 1 -maxdepth 1 -type d | while read -r service_dir; do
    add_token_to_env "$service_dir"
done

echo -e "\n"
echo "Token added to all services in $SERVICES_DIR"
