class RenameImageToImageUrlInBlogs < ActiveRecord::Migration[7.0]
  def change
    if column_exists?(:blogs, :image)
      rename_column :blogs, :image, :image_url
    end
  end
end
