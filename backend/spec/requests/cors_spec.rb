require "rails_helper"

RSpec.describe "CORS", type: :request do
  around do |example|
    previous_origins = ENV["CORS_ALLOWED_ORIGINS"]
    ENV["CORS_ALLOWED_ORIGINS"] = "https://frontend.example.com"
    example.run
  ensure
    ENV["CORS_ALLOWED_ORIGINS"] = previous_origins
  end

  it "returns CORS headers for allowed origins" do
    post "/api/v1/auth/register",
         params: { username: "demo_user", password: "password123" },
         headers: { "Origin" => "https://frontend.example.com" }

    expect(response.headers["Access-Control-Allow-Origin"]).to eq("https://frontend.example.com")
    expect(response.headers["Access-Control-Allow-Credentials"]).to eq("true")
  end

  it "answers preflight requests" do
    options "/api/v1/tasks",
            headers: {
              "Origin" => "https://frontend.example.com",
              "Access-Control-Request-Method" => "POST",
              "Access-Control-Request-Headers" => "Content-Type"
            }

    expect(response).to have_http_status(:no_content)
    expect(response.headers["Access-Control-Allow-Methods"]).to include("POST")
    expect(response.headers["Access-Control-Allow-Headers"]).to include("Content-Type")
  end
end
