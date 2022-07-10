module Api
  module V1
    class BlogsController < ApplicationController
      def index
        blogs = Blog.all

        render json: {
          blogs: blogs
        }, status: :ok

      end
    end
  end 
end
