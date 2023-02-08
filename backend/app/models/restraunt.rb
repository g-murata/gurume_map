class Restraunt < ApplicationRecord

  belongs_to :user
  has_many :reviews

  validates :name, presence: true, length: { maximum: 100 }
  
end
