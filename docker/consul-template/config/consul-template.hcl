template {
  source      = "/etc/consul-template/templates/nginx.ctmpl"
  destination = "/etc/nginx/conf.d/default.conf"
  wait {
    min = "2s"
    max = "10s"
  }
  exec {
      command = ["docker", "exec", "nginx-server", "nginx", "-s", "reload"]
      timeout = "30s"
  }
  error_on_missing_key = false
  backup = true
}

consul {
  address = "consul:8500"
  retry {
    enabled = true
    attempts = 10
    backoff = "5s"
  }
}
