module Api
  module V1
    class TagsController < ApplicationController
      def index
        tags = Tag.all.order(created_at: "DESC")

        render json: {
          tags: tags
        }, status: :ok
      end

    end
  end 
end
