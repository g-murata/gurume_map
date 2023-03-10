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
        review = Review.new(params.permit(:evaluation, :content, :restraunt_id))
        review.user_id = Restraunt.find(params[:restraunt_id]).user_id

        if review.save
          render json: {
            review: review,
            user_name: review.user.name
            },status: :ok
        else
          render status: review.errors
        end       
      end


      def update

      end

      def destroy

      end

    end
  end 
end
