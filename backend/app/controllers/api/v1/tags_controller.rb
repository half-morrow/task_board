module Api
  module V1
    class TagsController < ApplicationController
      before_action :require_login!

      def index
        render json: { data: current_user.tags.order(:name).map { |tag| TagSerializer.call(tag) } }
      end

      def create
        tag = current_user.tags.find_or_initialize_by(name: Tag.normalize_name(params[:name]))

        if tag.save
          render json: { data: TagSerializer.call(tag) }, status: :created
        else
          render_error("validation_error", "入力内容を確認してください", :unprocessable_entity, tag.errors.to_hash)
        end
      end

      def destroy
        current_user.tags.find(params[:id]).destroy!
        head :no_content
      end
    end
  end
end
