# Use the hashicorp/consul-template image as the base
FROM hashicorp/consul-template:latest

# Switch to root user, this is not safe for production
USER root

# Install Docker CLI
RUN apk add --no-cache docker-cli

# Copy the template file
COPY ./nginx/templates/nginx.ctmpl /etc/consul-template/templates/nginx.ctmpl

# Command to run consul-template
CMD ["consul-template", "-config", "/etc/consul-template/consul-template.hcl"]
