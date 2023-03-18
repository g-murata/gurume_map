class ChangeColumnOnEvaluationToReview < ActiveRecord::Migration[7.0]
  def change
    change_column :reviews, :evaluation, :float    
  end
end
