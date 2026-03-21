module Api
  module V1
    class UsersController < ApplicationController

      def index
        users = User.all  

        render json: {
          users: users
        }, status: :ok

      end

      def create
        user = User.new(params.permit(:name, :email))

        if user.save
          render json: user
        else
          render json: user.errors
        end       

      end

      def update
        user = User.find(params[:id])
        if user.update(params.permit(:name, :image))
          render json: { user: user.as_json(methods: [:reviews_count, :restraunts_count, :image_url]) }, status: :ok
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def get_user
        # メールアドレスで検索し、なければ新規作成する
        user = User.find_or_create_by(email: params[:email]) do |u|
          # 名前があればそれを使い、なければメールの@より前を名前にする
          u.name = params[:name].presence || params[:email].split('@').first
        end

        render json: {
          user: user.as_json(methods: [:reviews_count, :restraunts_count, :image_url])
        }, status: :ok
      end


    end
  end 
end
