class ApplicationController < ActionController::API
  include ActionController::Cookies
  before_action :set_cors_headers

  def options
    head :no_content
  end

  def up
    head :ok
  end

  private

  def current_user
    @current_user ||= User.find_by(id: session[:user_id])
  end

  def require_login!
    return if current_user

    render_error("unauthorized", "ログインしてください", :unauthorized)
  end

  def render_error(code, message, status, details = {})
    render json: { error: { code:, message:, details: } }, status:
  end

  def set_cors_headers
    origin = request.headers["Origin"]
    return unless origin.present? && allowed_cors_origins.include?(origin)

    headers["Access-Control-Allow-Origin"] = origin
    headers["Access-Control-Allow-Credentials"] = "true"
    headers["Access-Control-Allow-Methods"] = "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    headers["Access-Control-Allow-Headers"] =
      request.headers["Access-Control-Request-Headers"].presence ||
      "Content-Type, Accept, Authorization, X-CSRF-Token"
    headers["Vary"] = "Origin"
  end

  def allowed_cors_origins
    @allowed_cors_origins ||= begin
      raw_origins = ENV.fetch(
        "CORS_ALLOWED_ORIGINS",
        ENV.fetch("FRONTEND_ORIGIN", "")
      )
      raw_origins.split(",").map(&:strip).reject(&:empty?)
    end
  end
end
