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

    end
  end 
end
