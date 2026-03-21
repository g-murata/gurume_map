class User < ApplicationRecord
  include Rails.application.routes.url_helpers

  has_many :reviews, dependent: :destroy
  has_many :restraunts, dependent: :destroy
  has_one_attached :image

  validates :name, presence: true, uniqueness: true

  def reviews_count
    reviews.count
  end

  def restraunts_count
    restraunts.count
  end

  def image_url
    image.attached? ? url_for(image) : nil
  end
end
