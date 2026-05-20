module Api
  module V1
    class AuthController < ApplicationController
      before_action :require_login!, only: %i[me logout]

      def register
        user = User.new(user_params)

        if user.save
          session[:user_id] = user.id
          render json: { data: UserSerializer.call(user) }, status: :created
        else
          render_error("validation_error", "入力内容を確認してください", :unprocessable_entity, user.errors.to_hash)
        end
      end

      def login
        user = User.find_by(username: params[:username].to_s.strip)

        if user&.authenticate(params[:password].to_s)
          session[:user_id] = user.id
          render json: { data: UserSerializer.call(user) }
        else
          render_error("invalid_credentials", "ユーザ名またはパスワードが正しくありません", :unauthorized)
        end
      end

      def logout
        reset_session
        head :no_content
      end

      def me
        render json: { data: UserSerializer.call(current_user) }
      end

      private

      def user_params
        params.permit(:username, :password)
      end
    end
  end
end
