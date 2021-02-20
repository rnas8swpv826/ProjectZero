class CreateTransactions < ActiveRecord::Migration[6.1]
  def change
    create_table :transactions do |t|
      t.string :payee
      t.string :description
      t.float :amount_out
      t.timestamps
    end
  end
end
