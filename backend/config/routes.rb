Rails.application.routes.draw do
  get "/up", to: "application#up"

  namespace :api do
    namespace :v1 do
      post "auth/register", to: "auth#register"
      post "auth/login", to: "auth#login"
      delete "auth/logout", to: "auth#logout"
      get "auth/me", to: "auth#me"

      resources :tasks
      resources :tags, only: %i[index create destroy]
    end
  end

  match "*path", to: "application#options", via: :options
end
