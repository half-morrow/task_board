Rails.application.configure do
  config.secret_key_base = "test-secret-key-base"
  config.enable_reloading = false
  config.eager_load = ENV["CI"].present?
  config.cache_store = :null_store
  config.consider_all_requests_local = true
end
