class AddUserIdToRestraunt < ActiveRecord::Migration[7.0]
  def change
    add_reference :restraunts, :user, foreign_key: true
  end
end
