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
        user = Restraunt.new(params.permit(:name, :evaluation, :password, :lat, :lng))

        if user.save
          render json: user
        else
          render json: user.errors
        end       

      end

    end
  end 
end
