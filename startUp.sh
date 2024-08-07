#!/bin/bash

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
	echo "Node.js is not installed. Please install Node.js to continue."
	exit 1 
fi

echo "Node.js is installed, proceeding to install dependencies..."

# Install modules via pnpm
echo "Installing modules via pnpm..."

pnpm install

if [ $? -ne 0 ]; then
	echo "Failed to install modules. Please check the error messages."
	exit 1
fi

# util function to create these lil lines
generate_title() {
	echo -e "\n"
	if [ -n "$2" ]; then
        echo -e "* $2"
    fi
	printf '%*s' "$1" | tr ' ' '-'
	echo -e "\n"
}

copy_env_files() {
	generate_title 50 "Copying .env.example to .env in all services..."

    for service in ./services/*; do
        if [ -d "$service" ]; then
            if [ -f "$service/.env.example" ]; then
                cp "$service/.env.example" "$service/.env"
                echo " -> Copied .env.example to .env in $service"
            else
                echo " -> .env.example not found in $service"
            fi
        fi
    done
}

# Copy .env.example to .env in all services
copy_env_files

generate_title 45 "Generating Key Pairs (private & public)..."

# Running the script to generate key pairs
./scripts/generateKeys.sh

if [ $? -ne 0 ]; then
	echo "Failed to generate key pairs. Please check the error messages and try again."
	exit 1
fi

generate_title 30 "Starting the services..."

run_docker_compose_with_retries() {
  local retries=3
  local count=0
  until ./scripts/runDocker.sh dev up -d; do
    exit_code=$?
    count=$((count + 1))
    if [ "$count" -lt "$retries" ]; then
      echo "Retrying to start services in 8 secs... Attempt $count of $retries"
      sleep 8
    else
      echo "Failed to start the services after $count attempts."
      return $exit_code
    fi
  done
  return 0
}

# Running the docker compose script to start the services with retries
run_docker_compose_with_retries

if [ $? -ne 0 ]; then
	echo "Failed to start the services. Please check the error messages and try again."
	exit 1
fi

generate_title 30 "Creating databases..."

# Running the script to create databases
run_database_with_retries() {
  local retries=3
  local count=0
  until ./scripts/runDatabase.sh; do
    exit_code=$?
    count=$((count + 1))
    if [ "$count" -lt "$retries" ]; then
      echo "Retrying to create databases in 8 secs... Attempt $count of $retries"
      sleep 8
    else
      echo "Failed to create databases after $count attempts."
      return $exit_code
    fi
  done
  return 0
}

run_database_with_retries

generate_title 89
echo -e "	🥳🎉 Setup completed successfully. You can now access the services. 🎉🥳"
generate_title 89
