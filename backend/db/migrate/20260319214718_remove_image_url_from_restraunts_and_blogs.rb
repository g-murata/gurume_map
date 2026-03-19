class RemoveImageUrlFromRestrauntsAndBlogs < ActiveRecord::Migration[7.0]
  def change
    if column_exists?(:restraunts, :image_url)
      remove_column :restraunts, :image_url, :string
    end
    if column_exists?(:blogs, :image_url)
      remove_column :blogs, :image_url, :string
    end
  end
end
