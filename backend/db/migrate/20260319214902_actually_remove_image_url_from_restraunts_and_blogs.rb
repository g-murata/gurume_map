class ActuallyRemoveImageUrlFromRestrauntsAndBlogs < ActiveRecord::Migration[7.0]
  def up
    if column_exists?(:restraunts, :image_url)
      remove_column :restraunts, :image_url
    end
    if column_exists?(:blogs, :image_url)
      remove_column :blogs, :image_url
    end
  end

  def down
    add_column :restraunts, :image_url, :string unless column_exists?(:restraunts, :image_url)
    add_column :blogs, :image_url, :string unless column_exists?(:blogs, :image_url)
  end
end
