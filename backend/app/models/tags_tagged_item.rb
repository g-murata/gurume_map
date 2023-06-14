class TagsTaggedItem < ApplicationRecord
  belongs_to :tagged_item, polymorphic: true
  # has_many :tags
end
