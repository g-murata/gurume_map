class Restraunt < ApplicationRecord

  belongs_to :user
  has_many :reviews, dependent: :destroy
  has_many :tags_tagged_items, as: :tagged_item

  validates :name, presence: true, length: { maximum: 100 }
  
end
