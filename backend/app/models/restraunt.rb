class Restraunt < ApplicationRecord

  belongs_to :user
  belongs_to :area
  has_many :reviews, dependent: :destroy
  has_many :tags_tagged_items, as: :tagged_item, dependent: :destroy
  has_one_attached :image

  validates :name, presence: true, length: { maximum: 100 }
  validates :description, length: { maximum: 100 }
  
end
