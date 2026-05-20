module Api
  module V1
    class TasksController < ApplicationController
      before_action :require_login!
      before_action :set_task, only: %i[show update destroy]

      def index
        result = TaskSearchQuery.new(current_user:, params:).call

        render json: {
          data: result.records.map { |task| TaskSerializer.call(task) },
          meta: result.meta
        }
      end

      def show
        render json: { data: TaskSerializer.call(@task) }
      end

      def create
        task = current_user.tasks.new(task_params.except(:tag_names))
        TaskTagAssigner.call(task:, tag_names: task_params[:tag_names], user: current_user)

        if task.save
          render json: { data: TaskSerializer.call(task) }, status: :created
        else
          render_error("validation_error", "入力内容を確認してください", :unprocessable_entity, task.errors.to_hash)
        end
      end

      def update
        @task.assign_attributes(task_params.except(:tag_names))
        TaskTagAssigner.call(task: @task, tag_names: task_params[:tag_names], user: current_user) if task_params.key?(:tag_names)

        if @task.save
          render json: { data: TaskSerializer.call(@task) }
        else
          render_error("validation_error", "入力内容を確認してください", :unprocessable_entity, @task.errors.to_hash)
        end
      end

      def destroy
        @task.destroy!
        head :no_content
      end

      private

      def set_task
        @task = current_user.tasks.includes(:tags).find(params[:id])
      end

      def task_params
        params.permit(:title, :description, :status, :due_date, tag_names: [])
      end
    end
  end
end
