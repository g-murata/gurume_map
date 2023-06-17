class Tag < ApplicationRecord
  has_many :tags_tagged_items, foreign_key: :tag_id, dependent: :destroy

  scope :category_restaurant, -> { where(category: "レストラン") }
end
