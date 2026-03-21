module Api
  module V1
    class ReviewsController < ApplicationController
      include Rails.application.routes.url_helpers

      def index
        reviews = Review.with_attached_image.includes(:user).order(created_at: :DESC)

        render json: {
          reviews: reviews.map { |r| review_with_image_url(r).merge("user_name" => r.user.name, "email" => r.user.email, "user_image_url" => r.user.image_url) }
        }, status: :ok
      end

      def show
        reviews = Review.with_attached_image.where(restraunt_id: params[:id]).includes(:user).order(created_at: :DESC)

        render json: {
          review: reviews.map { |r| review_with_image_url(r).merge("user_name" => r.user.name, "email" => r.user.email, "user_image_url" => r.user.image_url) }
        }, status: :ok
      end

      def create
        review = Review.new(review_params)
        review.user_id = User.where(email: params[:email]).pick(:id)

        if review.save
          review.reload
          render json: {
            review: review_with_image_url(review).merge("user_name" => review.user.name, "email" => review.user.email, "user_image_url" => review.user.image_url),
            user_name: review.user.name
          }, status: :ok
        else
          render json: review.errors, status: :unprocessable_entity
        end       
      end

      def update
        review = Review.find(params[:id])

        if params[:delete_image] == "true"
          review.image.purge
        end

        if review.update(review_params)
          review.reload
          render json: {
            reviews: review_with_image_url(review).merge("user_name" => review.user.name, "email" => review.user.email, "user_image_url" => review.user.image_url)
          }, status: :ok
        else
          render json: review.errors, status: :unprocessable_entity
        end       
      end

      def destroy
        puts "Destroying review with ID: #{params[:id]}"
        review = Review.find(params[:id])

        if review.destroy
          render json: {
            review: review
          }, status: :ok
        else
          render json: review.errors, status: :unprocessable_entity
        end       
      end

      def check_users_without_review
        user = User.find_by(email: params[:email])
        if user
          review = Review.where(restraunt_id: params[:restraunt_id], user_id: user.id).blank?
          render json: {
            review: review
          }, status: :ok
        else
          render json: {
            review: false
          }, status: :ok
        end
      end

      def get_latest_reviews
        review = Review.order(created_at: :desc).first

        render json: {
          review: review,
          restraunt: review&.restraunt,
        }, status: :ok
      end

      private

      def review_params
        params.permit(:evaluation, :content, :restraunt_id, :image)
      end

      def review_with_image_url(review)
        data = review.as_json
        data["image_url"] = review.image.attached? ? url_for(review.image) : nil
        data
      end

    end
  end 
end
