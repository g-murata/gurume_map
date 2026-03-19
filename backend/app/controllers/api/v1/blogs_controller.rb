module Api
  module V1
    class BlogsController < ApplicationController
      include Rails.application.routes.url_helpers

      def index
        blogs = Blog.with_attached_image.all.order(created_at: "DESC")

        render json: {
          blogs: blogs.map do |blog|
            blog.as_json.merge(
              image_url: blog.image.attached? ? url_for(blog.image) : blog.image_url
            )
          end
        }, status: :ok
      end

      def show
        blog = Blog.find(params[:id])
        render json: {
          blogs: blog.as_json.merge(
            image_url: blog.image.attached? ? url_for(blog.image) : blog.image_url
          )
        }, status: :ok
      end

    end
  end 
end
