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


      def update
        restraunt = Restraunt.find(params[:id])
       
        if restraunt.update(name: params[:name], evaluation: params[:evaluation], review: params[:review])
          render json: {
            restraunts: restraunt
            },status: :ok
        else
          render status: restraunt.errors
        end       

      end

      def destroy
        restraunt = Restraunt.find(params[:id])
       
        if restraunt.destroy
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
