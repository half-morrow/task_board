require_relative "boot"

require "rails"
require "active_model/railtie"
require "active_record/railtie"
require "action_controller/railtie"

Bundler.require(*Rails.groups)

module TaskBoard
  class Application < Rails::Application
    config.load_defaults 8.0
    config.api_only = true
    config.time_zone = "Asia/Tokyo"
    config.autoload_paths << Rails.root.join("app/queries")
    config.session_store :cookie_store,
                         key: "_task_board_session",
                         same_site: Rails.env.production? ? :none : :lax,
                         secure: Rails.env.production?
    config.middleware.use ActionDispatch::Cookies
    config.middleware.use config.session_store, config.session_options
  end
end
