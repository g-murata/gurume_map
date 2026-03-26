module Api
  module V1
    class TagsController < ApplicationController
      # ！！！重要！！！
      # before_action :authenticate_user! # deviseなどの認証
      # before_action :require_admin!     # 管理者権限のチェック

      def index
        tags = Tag.all.order(:id)
        render json: { tags: tags }
      end

      def create
        tag = Tag.new(tag_params)
        if tag.save
          render json: tag, status: :created
        else
          render json: { errors: tag.errors.full_messages }, status: :unprocessable_entity
        end
      rescue => e
        render json: { 
          error: e.message,
          error_class: e.class.name,
          backtrace: e.backtrace.first(5)
        }, status: :unprocessable_entity
      end

      def update
        tag = Tag.find(params[:id])
        if tag.update(tag_params)
          render json: tag
        else
          render json: { errors: tag.errors.full_messages }, status: :unprocessable_entity
        end
      rescue => e
        render json: { 
          error: e.message,
          error_class: e.class.name,
          backtrace: e.backtrace.first(5)
        }, status: :unprocessable_entity
      end

      def destroy
        tag = Tag.find(params[:id])
        if tag.destroy
          head :no_content
        else
          render json: { errors: tag.errors.full_messages }, status: :unprocessable_entity
        end
      rescue => e
        render json: { 
          error: e.message,
          error_class: e.class.name,
          backtrace: e.backtrace.first(5)
        }, status: :unprocessable_entity
      end

      private

      def tag_params
        params.require(:tag).permit(:name, :category)
      end
    end
  end 
end
