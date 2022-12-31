class Restraunt < ApplicationRecord

  belongs_to :user

  validates :name, presence: true, length: { maximum: 100 }
  validates :evaluation, presence: true, numericality: {greater_than: 0,less_than_or_equal_to: 5}
  validates :review, presence: true, length: { maximum: 1000 }
  
end
