Rails.application.configure do
  config.secret_key_base = ENV.fetch("SECRET_KEY_BASE")
  config.enable_reloading = false
  config.eager_load = true
  config.consider_all_requests_local = false
end
