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
              restaurant: restraunt_with_image_url(restaurant).merge(
                "user_name" => restaurant.user_name,
                "user_email" => restaurant.user_email
              ),
              tags_tagged_items: restaurant.tags_tagged_items
            }
          end
        }, status: :ok

      end

      def create
        restraunt = Restraunt.new(restraunt_params.except(:email))
        restraunt.user_id = User.where(email: params[:email]).pick(:id)

        if restraunt.save
          restraunt.reload
          render json: {
            restraunts: restraunt_with_image_url(restraunt).merge("user_name" => restraunt.user.name)
          }, status: :ok
        else
          render json: restraunt.errors, status: :unprocessable_entity
        end       
      end

      def update
        restraunt = Restraunt.find(params[:id])

        if params[:delete_image] == "true"
          restraunt.image.purge
        end

        if restraunt.update(restraunt_params)
          restraunt.reload
          render json: {
            restraunts: restraunt_with_image_url(restraunt)
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



      private

      def restraunt_params
        params.permit(:name, :lat, :lng, :url, :description, :area_id, :image, :email)
      end

      def restraunt_with_image_url(restraunt)
        data = restraunt.as_json
        data["image_url"] = restraunt.image.attached? ? url_for(restraunt.image) : nil
        data
      end

    end
  end 
end
