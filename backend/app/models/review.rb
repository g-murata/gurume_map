class Review < ApplicationRecord
  belongs_to :restraunt
  belongs_to :user
  has_one_attached :image

  validates :evaluation, presence: true, numericality: {greater_than: 0,less_than_or_equal_to: 5}
  validates :content, length: { maximum: 1000 }, allow_blank: true
  
end
