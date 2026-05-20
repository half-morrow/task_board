Rails.application.configure do
  config.secret_key_base = ENV.fetch("SECRET_KEY_BASE", "development-secret-key-base")
  config.enable_reloading = true
  config.eager_load = false
  config.consider_all_requests_local = true
  config.hosts << "backend"
  config.server_timing = true
end
