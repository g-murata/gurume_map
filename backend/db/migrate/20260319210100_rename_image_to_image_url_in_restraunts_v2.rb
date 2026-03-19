class RenameImageToImageUrlInRestrauntsV2 < ActiveRecord::Migration[7.0]
  def change
    if column_exists?(:restraunts, :image)
      rename_column :restraunts, :image, :image_url
    end
  end
end
