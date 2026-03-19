module Api
  module V1
    class BlogsController < ApplicationController
      def index
        blogs = Blog.with_attached_image.all.order(created_at: "DESC")

        render json: {
          blogs: blogs.map do |blog|
            {
              id: blog.id,
              title: blog.title,
              content: blog.content,
              created_at: blog.created_at,
              updated_at: blog.updated_at,
              image_url: blog.image.attached? ? rails_blob_url(blog.image, only_path: false) : nil
            }
          end
        }, status: :ok
      end

      def show
        blog = Blog.find(params[:id])
        render json: {
          blogs: {
            id: blog.id,
            title: blog.title,
            content: blog.content,
            created_at: blog.created_at,
            updated_at: blog.updated_at,
            image_url: blog.image.attached? ? rails_blob_url(blog.image, only_path: false) : nil
          }
        }, status: :ok
      end

    end
  end 
end
