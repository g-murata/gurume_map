module Api
  module V1
    class RestrauntsController < ApplicationController
      def index
        # TODO: このSQLだとレビューの数だけお店が表示される課題あり。
        restraunts = Restraunt.joins(:user).joins(:reviews).
                      joins("inner join users as users2 on reviews.user_id = users2.id").
                      select(:id, :name, :image, :lat, :lng, :user_id, "reviews.content, reviews.evaluation, users.name as user_name, users2.name as reviewer")  
        render json: {
          restraunts: restraunts
        }, status: :ok

      end

      def create
        restraunt = Restraunt.new(params.permit(:name, :lat, :lng))
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