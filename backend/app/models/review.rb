class Review < ApplicationRecord
  belongs_to :restraunt
  belongs_to :user

  validates :evaluation, presence: true, numericality: {greater_than: 0,less_than_or_equal_to: 5}
  validates :content, presence: true, length: { maximum: 1000 }

end
