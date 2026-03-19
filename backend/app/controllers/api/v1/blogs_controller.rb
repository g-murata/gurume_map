module Api
  module V1
    class BlogsController < ApplicationController
      include Rails.application.routes.url_helpers

      def index
        blogs = Blog.with_attached_image.all.order(created_at: "DESC")

        render json: {
          blogs: blogs.map do |blog|
            data = blog.as_json
            data["image_url"] = blog.image.attached? ? url_for(blog.image) : blog.image
            data
          end
        }, status: :ok
      end

      def show
        blog = Blog.find(params[:id])
        data = blog.as_json
        data["image_url"] = blog.image.attached? ? url_for(blog.image) : blog.image
        render json: {
          blogs: data
        }, status: :ok
      end

    end
  end 
end
