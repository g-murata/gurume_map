module Api
  module V1
    class AreasController < ApplicationController
      # ！！！重要！！！
      # before_action :authenticate_user! # deviseなどの認証
      # before_action :require_admin!     # 管理者権限のチェック

      def index
        areas = Area.all.order(:id)
        render json: { areas: areas }
      end

      def create
        area = Area.new(area_params)
        if area.save
          render json: area, status: :created
        else
          render json: { errors: area.errors.full_messages }, status: :unprocessable_entity
        end
      rescue => e
        render json: { error: e.message }, status: :internal_server_error
      end

      def update
        area = Area.find(params[:id])
        if area.update(area_params)
          render json: area
        else
          render json: { errors: area.errors.full_messages }, status: :unprocessable_entity
        end
      rescue => e
        render json: { error: e.message }, status: :internal_server_error
      end

      def destroy
        area = Area.find(params[:id])
        if area.destroy
          head :no_content
        else
          render json: { errors: area.errors.full_messages }, status: :unprocessable_entity
        end
      rescue => e
        render json: { error: e.message }, status: :internal_server_error
      end

      private

      def area_params
        params.require(:area).permit(:name, :lat, :lng)
      end
    end
  end 
end
