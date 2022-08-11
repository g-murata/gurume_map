class AddColumnRestraunts < ActiveRecord::Migration[7.0]
  def change
    add_column :restraunts, :evaluation, :integer
    add_column :restraunts, :review, :string
    add_column :restraunts, :image, :string        
    add_column :restraunts, :lat, :float
    add_column :restraunts, :lng, :float
  end
end
