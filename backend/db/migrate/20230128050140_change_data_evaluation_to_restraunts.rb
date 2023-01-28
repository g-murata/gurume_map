class ChangeDataEvaluationToRestraunts < ActiveRecord::Migration[7.0]
  def change
    change_column :restraunts, :evaluation, :float
  end
end
