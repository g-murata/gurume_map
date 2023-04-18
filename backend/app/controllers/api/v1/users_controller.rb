module Api
  module V1
    class UsersController < ApplicationController

      def index
        users = User.all  

        render json: {
          users: users
        }, status: :ok

      end

      def create
        user = User.new(params.permit(:name, :email, :password))

        if user.save
          render json: user
        else
          render json: user.errors
        end       

      end

      def get_user
        user = User.find_by(email: params[:email])      

        render json: {
          user: user
        }, status: :ok

      end


    end
  end 
end
