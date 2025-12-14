module Api
  module V1
    class RestrauntsController < ApplicationController
    include Rails.application.routes.url_helpers # URLヘルパーをコントローラーで使うためにインクルード

      def index
        restraunts = Restraunt.includes(:tags_tagged_items).joins(:user)
                      .select("restraunts.*, users.name as user_name, users.email as user_email")
                      .order(created_at: :DESC)
                      .order("tags_tagged_items.tag_id")

        render json: {
          restraunts: restraunts.map do |restaurant|
            
            # 🌟 Active StorageのURLを取得する処理
            image_url = if restaurant.image.attached?
                          # variant (バリアント) を使って、表示用のサイズに変換したURLを取得するのが一般的です。
                          # 例: 300x300にリサイズして表示する (環境に合わせて変更してください)
                          # Rails.application.routes.url_helpers.rails_representation_url(restaurant.image.variant(resize_to_limit: [300, 300]), only_path: true)
                          
                          # 一旦、オリジナルのファイルURLを取得する
                          url_for(restaurant.image)
                        else
                          nil # 画像がない場合はnil
                        end

            {
              restaurant: restaurant.attributes.merge({ # restaurantオブジェクトの属性とURLをマージ
                image_url: image_url
              }),
              tags_tagged_items: restaurant.tags_tagged_items
            }
          end
        }, status: :ok
        
      end

      def create
          # Strong Parametersの定義がシンプルでOK
          restraunt = Restraunt.new(params.permit(:name, :lat, :lng, :url, :description, :area_id, :image))
          restraunt.user_id = User.where(email: params[:email]).pick(:id)
          
          if restraunt.save
            
            # 🌟 成功時に画像のURLを生成する処理を追加
            image_url = if restraunt.image.attached?
                          # indexと同じく、url_for(restraunt.image) または variant を使う
                          url_for(restraunt.image) 
                        else
                          nil
                        end
            
            # 🌟 レスポンスに image_url を含めて返す
            render json: {
              restraunts: restraunt.attributes.merge({
                image_url: image_url, # 新しいURLを追加
                user_name: restraunt.user.name # ユーザー名も追加
              }),
            }, status: :created # 新規作成なので status: :created (201) が適切です
            
          else
            # エラー時の処理はそのまま
            render json: { errors: restraunt.errors.full_messages }, status: :unprocessable_entity
          end       
        end


      def update
        restraunt = Restraunt.find(params[:id])

        if restraunt.update(params.permit(:name, :url, :description, :image))
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
