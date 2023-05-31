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
                      select(:id, :content, :evaluation, "users.id as user_id, users.name as user_name, users.email")  


        render json: {
          review: review
        }, status: :ok

      end


      def create
        review = Review.new(params.permit(:evaluation, :content, :restraunt_id))
        review.user_id = User.where(email: params[:email]).pick(:id)

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
        review = Review.find(params[:id])

        if review.update(params.permit(:evaluation, :content))
          render json: {
            reviews: review
            },status: :ok
        else
          render status: review.errors
        end       

      end

      def destroy
        review = Review.find(params[:id])

        if review.destroy
          render json: {
            reviewｓ: review
            },status: :ok
        else
          render status: review.errors
        end       

      end

      def check_users_without_review
        user_id = User.find_by(email: params[:email]).id
        review = Restraunt.find(params[:restraunt_id]).reviews.where(user_id: user_id).blank?
        render json: {
          review: review
        }, status: :ok
      end

      def get_latest_reviews
        review = Review.order(created_at: :desc).first

        render json: {
          review: review,
          restraunt: review.restraunt,
        }, status: :ok
      end

    end
  end 
end
