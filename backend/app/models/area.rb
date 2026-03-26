class Area < ApplicationRecord
  has_many :restraunts, class_name: 'Restraunt', dependent: :restrict_with_error
  validates :name, presence: true, length: { maximum: 50 }
end
