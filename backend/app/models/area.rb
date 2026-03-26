class Area < ApplicationRecord
  has_many :restaurants, dependent: :restrict_with_error
end
