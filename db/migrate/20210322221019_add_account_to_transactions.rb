class AddAccountToTransactions < ActiveRecord::Migration[6.1]
  def change
    add_reference :transactions, :account
  end
end
