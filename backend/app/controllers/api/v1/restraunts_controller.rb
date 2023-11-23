module Api
  module V1
    class RestrauntsController < ApplicationController
      def index
        restraunts = Restraunt.includes(:tags_tagged_items).joins(:user)
                      .select("restraunts.*, users.name as user_name, users.email as user_email")
                      .order(created_at: :DESC)
                      .order("tags_tagged_items.tag_id")

        render json: {
          restraunts: restraunts.map do |restaurant|
            {
              restaurant: restaurant,
              tags_tagged_items: restaurant.tags_tagged_items
            }
          end
        }, status: :ok
        
      end

      def create
        restraunt = Restraunt.new(params.permit(:name, :lat, :lng))
        restraunt.user_id = User.where(email: params[:email]).pick(:id)

        if restraunt.save
          render json: {
            restraunts: restraunt,
            user_name: restraunt.user.name
            },status: :ok
        else
          render status: restraunt.errors
        end       

      end


      def update
        restraunt = Restraunt.find(params[:id])

        if restraunt.update(name: params[:name])
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