module Api
  module V1
    class TagsController < ApplicationController
      def index
        tags = Tag.category_restaurant.order(id: "ASC")

        render json: {
          tags: tags
        }, status: :ok
      end

    end
  end 
end
