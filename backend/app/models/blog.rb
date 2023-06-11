class Blog < ApplicationRecord
  has_many :tags_tagged_items, as: :tagged_item
end
