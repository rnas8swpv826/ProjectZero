class AddDateToTransactions < ActiveRecord::Migration[6.1]
  def change
    add_column :transactions, :transaction_date, :date
  end
end
