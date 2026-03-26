class ResetAllSequences < ActiveRecord::Migration[7.0]
  def up
    # データベースのすべてのテーブルを取得して、IDシーケンスを最新の状態にリセットする
    ActiveRecord::Base.connection.tables.each do |table_name|
      # IDカラムを持つテーブルのみ対象とする
      if ActiveRecord::Base.connection.column_exists?(table_name, :id)
        ActiveRecord::Base.connection.reset_pk_sequence!(table_name)
      end
    end
  end

  def down
    # 元に戻す必要はないため、何もしない
  end
end
