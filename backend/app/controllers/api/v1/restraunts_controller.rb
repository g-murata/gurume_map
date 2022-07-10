module Api
  module V1
    class RestrauntsController < ApplicationController
      def index
        restraunts = Restraunt.all

        render json: {
          restraunts: restraunts
        }, status: :ok

      end
    end
  end 
end
