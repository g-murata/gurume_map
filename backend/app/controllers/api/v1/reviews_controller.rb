module Api
  module V1
    class ReviewsController < ApplicationController

      def index
        reviews = Review.joins(:user).joins(:restraunt).
                        select(:id, :content, :evaluation, "users.name as user_name, restraunts.id as restraunt_id")  

        render json: {
          reviews: reviews
        }, status: :ok

      end

      def show
        review = Review.where(restraunt_id: params[:id]).joins(:user).
                      select(:id, :content, :evaluation, "users.name as user_name")  


        render json: {
          review: review
        }, status: :ok

      end


      def create

      end


      def update

      end

      def destroy

      end

    end
  end 
end