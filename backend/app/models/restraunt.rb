class Restraunt < ApplicationRecord

  belongs_to :user
  has_many :reviews, dependent: :destroy

  validates :name, presence: true, length: { maximum: 100 }
  
end
