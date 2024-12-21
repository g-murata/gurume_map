module Api
  module V1
    class AreasController < ApplicationController
      def index
        areas = Area.all.order(id: "ASC")

        render json: {
          areas: areas
        }, status: :ok
      end

    end
  end 
end
