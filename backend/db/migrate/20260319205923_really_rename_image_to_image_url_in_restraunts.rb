class ReallyRenameImageToImageUrlInRestraunts < ActiveRecord::Migration[7.0]
  def change
    rename_column :restraunts, :image, :image_url
  end
end
