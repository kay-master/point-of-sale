# Use an official NGINX image as the base
FROM nginx:latest

# Install curl and unzip (optional, for downloading Consul Template)
RUN apt-get update && \
    apt-get install -y curl unzip && \
    rm -rf /var/lib/apt/lists/*

# Set environment variables
ENV CONSUL_TEMPLATE_VERSION=0.27.0

# Download and install Consul Template
RUN curl -Lo /tmp/consul-template.zip https://releases.hashicorp.com/consul-template/${CONSUL_TEMPLATE_VERSION}/consul-template_${CONSUL_TEMPLATE_VERSION}_linux_amd64.zip && \
    unzip /tmp/consul-template.zip -d /usr/local/bin && \
    chmod +x /usr/local/bin/consul-template && \
    rm /tmp/consul-template.zip

# Copy the NGINX config template
# COPY ./nginx.ctmpl /etc/nginx/nginx.ctmpl

# Copy a custom NGINX configuration file (if necessary)
# COPY nginx.conf /etc/nginx/nginx.conf

# Command to run Consul Template and NGINX
CMD ["/bin/sh", "-c", "consul-template -template '/etc/nginx/nginx.ctmpl:/etc/nginx/nginx.conf:nginx -s reload' & nginx -g 'daemon off;'"]
