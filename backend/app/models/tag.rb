class Tag < ApplicationRecord
  has_many :tags_tagged_items, foreign_key: :tag_id, dependent: :restrict_with_error

  scope :category_restaurant, -> { where(category: "レストラン") }

  validates :name, presence: true, length: { maximum: 50 }
end
