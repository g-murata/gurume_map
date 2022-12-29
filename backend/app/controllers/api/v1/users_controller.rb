module Api
  module V1
    class UsersController < ApplicationController
      def create
        user = User.new(params.permit(:email, :password))

        if user.save
          render json: user
        else
          render json: user.errors
        end       

      end
    end
  end 
end
