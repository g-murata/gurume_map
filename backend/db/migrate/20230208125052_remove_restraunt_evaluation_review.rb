class RemoveRestrauntEvaluationReview < ActiveRecord::Migration[7.0]
  def up
    remove_column :restraunts, :evaluation, :float
    remove_column :restraunts, :review, :string        
  end

  def down
    add_column  :restraunts, :evaluation, :float
    add_column  :restraunts, :review, :string        
  end

end
