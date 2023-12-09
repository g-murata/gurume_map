class Restraunt < ApplicationRecord

  belongs_to :user
  has_many :reviews, dependent: :destroy
  has_many :tags_tagged_items, as: :tagged_item, dependent: :destroy

  validates :name, presence: true, length: { maximum: 100 }
  validates :description, length: { maximum: 100 }
  
end
