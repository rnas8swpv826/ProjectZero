class AddCategoryToTransactions < ActiveRecord::Migration[6.1]
  def change
    add_reference :transactions, :category
  end
end
