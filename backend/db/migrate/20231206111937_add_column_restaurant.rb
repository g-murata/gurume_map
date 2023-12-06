class AddColumnRestaurant < ActiveRecord::Migration[7.0]
  def change
    add_column :restraunts, :url, :string
    add_column :restraunts, :description, :string    
  end
end
