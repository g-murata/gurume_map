class AddLatAndLngToArea < ActiveRecord::Migration[7.0]
  def change
    add_column :areas, :lat, :float
    add_column :areas, :lng, :float
  end
end
