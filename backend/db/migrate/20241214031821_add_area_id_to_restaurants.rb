class AddAreaIdToRestaurants < ActiveRecord::Migration[7.0]
  def change
    add_reference :restraunts, :area, foreign_key: true
  end
end
