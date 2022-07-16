module Api
  module V1
    class BlogsController < ApplicationController
      def index
        blogs = Blog.all.order(created_at: "DESC")

        render json: {
          blogs: blogs
        }, status: :ok

      end
    end
  end 
end
