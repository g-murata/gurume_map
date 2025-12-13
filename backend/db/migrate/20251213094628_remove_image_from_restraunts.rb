class RemoveImageFromRestraunts < ActiveRecord::Migration[7.0]
  def change
    remove_column :restraunts, :image, :string
  end
end
