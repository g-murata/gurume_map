class CreateTaggedItems < ActiveRecord::Migration[7.0]
  def change
    create_table :tags_tagged_items do |t|
      t.references :tagged_item, polymorphic: true, null: false
      t.references :tag, null: false, foreign_key: true

      t.timestamps
    end
  end
end
