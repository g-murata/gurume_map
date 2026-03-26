class User < ApplicationRecord
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
    image.attached? ? Rails.application.routes.url_helpers.url_for(image) : nil
  rescue
    nil
  end
end
