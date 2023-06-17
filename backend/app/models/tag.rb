class Tag < ApplicationRecord
  scope :category_restaurant, -> { where(category: "レストラン") }
end
