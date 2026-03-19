module Api
  module V1
    class RestrauntsController < ApplicationController
      include Rails.application.routes.url_helpers

      def index
        restraunts = Restraunt.with_attached_image.includes(:tags_tagged_items).joins(:user)
                      .select("restraunts.*, users.name as user_name, users.email as user_email")
                      .order(created_at: :DESC)
                      .order("tags_tagged_items.tag_id")

        render json: {
          restraunts: restraunts.map do |restaurant|
            {
              restaurant: restaurant.as_json.merge(
                image_url: restaurant.image.attached? ? url_for(restaurant.image) : restaurant.image_url,
                user_name: restaurant.user_name,
                user_email: restaurant.user_email
              ),
              tags_tagged_items: restaurant.tags_tagged_items
            }
          end
        }, status: :ok
        
      end

      def create
        restraunt = Restraunt.new(params.permit(:name, :lat, :lng, :url, :description, :area_id, :image))
        restraunt.user_id = User.where(email: params[:email]).pick(:id)
        if restraunt.save
          render json: {
            restraunts: restraunt.as_json.merge(
              image_url: restraunt.image.attached? ? url_for(restraunt.image) : restraunt.image_url,
              user_name: restraunt.user.name
            )
          }, status: :ok
        else
          render json: restraunt.errors, status: :unprocessable_entity
        end       

      end


      def update
        restraunt = Restraunt.find(params[:id])

        if restraunt.update(params.permit(:name, :url, :description, :image))
          render json: {
            restraunts: restraunt.as_json.merge(
              image_url: restraunt.image.attached? ? url_for(restraunt.image) : restraunt.image_url
            )
          }, status: :ok
        else
          render json: restraunt.errors, status: :unprocessable_entity
        end       

      end

      def destroy
        restraunt = Restraunt.find(params[:id])

        if restraunt.destroy
          render json: {
            restraunts: restraunt
          }, status: :ok
        else
          render json: restraunt.errors, status: :unprocessable_entity
        end       

      end

    end
  end 
end