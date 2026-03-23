module Api
  module V1
    class RestrauntsController < ApplicationController
      include Rails.application.routes.url_helpers

      def index
        restraunts = Restraunt.with_attached_image.includes(:tags_tagged_items, :user, :reviews)
                      .select("restraunts.*, users.name as user_name, users.email as user_email")
                      .order(created_at: :DESC)
                      .order("tags_tagged_items.tag_id")

        render json: {
          restraunts: restraunts.map do |restaurant|
            {
              restaurant: serialized_restraunt(restaurant),
              tags_tagged_items: restaurant.tags_tagged_items
            }
          end
        }, status: :ok
      end

      def create
        Restraunt.transaction do
          @restraunt = Restraunt.new(restraunt_params.except(:email, :evaluation, :review_content, :review_image))
          @restraunt.user_id = User.where(email: params[:email]).pick(:id)
          @restraunt.save!

          # レビュー情報があれば作成（本文がある、画像がある、または評価がデフォルトの3以外）
          has_content = params[:review_content].present?
          has_image = params[:review_image].present?
          has_changed_evaluation = params[:evaluation].present? && params[:evaluation].to_i != 3

          if has_content || has_image || has_changed_evaluation
            Review.create!(
              restraunt_id: @restraunt.id,
              user_id: @restraunt.user_id,
              evaluation: params[:evaluation] || 3,
              content: params[:review_content] || "",
              image: params[:review_image]
            )
          end
        end

        @restraunt.reload
        render json: {
          restraunt: serialized_restraunt(@restraunt),
          tags_tagged_items: @restraunt.tags_tagged_items
        }, status: :ok
      rescue => e
        render json: { error: e.message }, status: :unprocessable_entity
      end

      def update
        restraunt = Restraunt.find(params[:id])

        if params[:delete_image] == "true"
          restraunt.image.purge
        end

        if restraunt.update(restraunt_params)
          restraunt.reload
          render json: {
            restraunt: serialized_restraunt(restraunt),
            tags_tagged_items: restraunt.tags_tagged_items
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
        params.permit(:name, :lat, :lng, :url, :description, :area_id, :image, :email, :evaluation, :review_content, :review_image)
      end

      def serialized_restraunt(restraunt)
        data = restraunt.as_json
        data["image_url"] = restraunt.image.attached? ? rails_blob_url(restraunt.image, only_path: false) : nil
        
        # レストランのレビュー統計
        reviews = restraunt.reviews
        data["average_evaluation"] = reviews.empty? ? 0 : (reviews.sum(:evaluation).to_f / reviews.size).round(1)
        data["total_reviews_count"] = reviews.size
        
        latest_review = reviews.order(created_at: :desc).first
        data["latest_review_content"] = latest_review&.content
        data["latest_review_evaluation"] = latest_review&.evaluation

        # userが存在する場合のみマージ（destroyなどでnilになる可能性を考慮）
        if restraunt.user
          data = data.merge(
            "user_name" => restraunt.user.name,
            "user_email" => restraunt.user.email,
            "user_image_url" => restraunt.user.image_url,
            "user_id" => restraunt.user_id,
            "user_reviews_count" => restraunt.user.reviews_count,
            "user_restraunts_count" => restraunt.user.restraunts_count
          )
        end
        data
      end

    end
  end 
end
