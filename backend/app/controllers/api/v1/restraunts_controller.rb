module Api
  module V1
    class RestrauntsController < ApplicationController
      def index
        restraunts = Restraunt.all

        render json: {
          restraunts: restraunts
        }, status: :ok

      end

      def create
        restraunt = Restraunt.new(params.permit(:name, :evaluation, :review, :lat, :lng))
        restraunt.user_id = User.where(email: params[:email]).pick(:id)
        
        if restraunt.save
          render json: {
            restraunts: restraunt
            },status: :ok
        else
          render status: restraunt.errors
        end       

      end

    end
  end 
end
