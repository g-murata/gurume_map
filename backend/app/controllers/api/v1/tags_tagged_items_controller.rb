module Api
  module V1
    class TagsTaggedItemsController < ApplicationController
      def create
        tags_tagged_item = TagsTaggedItem.new(params.permit(:tagged_item_type, :tagged_item_id, :tag_id))

        if tags_tagged_item.save
          render json: {
            tags_tagged_item: tags_tagged_item
          }, status: :ok  
        else
          render status: review.errors
        end
      end

      def destroy
        tags_tagged_items = TagsTaggedItem.where(tagged_item_id: params[:id])
        if tags_tagged_items.destroy_all
          render json: {
            tags_tagged_items: tags_tagged_items
            },status: :ok
        else
          render status: tags_tagged_items.errors
        end       

      end

    end
  end 
end
