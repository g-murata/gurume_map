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
        user = User.new(params.permit(:name, :email, :password))

        if user.save
          render json: user
        else
          render json: user.errors
        end       

      end

      def get_user
        # メールアドレスで検索し、なければ新規作成する
        user = User.find_or_create_by(email: params[:email]) do |u|
          # 名前があればそれを使い、なければメールの@より前を名前にする
          u.name = params[:name].presence || params[:email].split('@').first
          u.password = SecureRandom.hex(10) # ダミーパスワード
        end

        render json: {
          user: user
        }, status: :ok
      end


    end
  end 
end
