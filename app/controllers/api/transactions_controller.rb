class Api::TransactionsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index # index is a method
    transactions = Transaction.all
    categories = Category.all
    transactions_json = transactions.as_json
    transactions.each_with_index do |transaction, index|
      transactions_json[index]['account_name'] = transaction.account&.name # & is used for safe nav
      transactions_json[index]['amount_out'] = '%.2f' %transaction.amount_out
      if transaction.category.parent_id != nil
        parent_id = transaction.category.parent_id
        transactions_json[index]['category_name'] = categories.find(parent_id).name
        transactions_json[index]['category_id'] = parent_id
        transactions_json[index]['subcategory_name'] = transaction.category.name
        transactions_json[index]['subcategory_id'] = transaction.category_id
      else
        transactions_json[index]['category_name'] = transaction.category.name
      end
    end
    render json: transactions_json
  end

  def create
    transaction = Transaction.new(transaction_params)
    if transaction.save
      render json: transaction
    else
      render json: {
        data: transaction.errors
      }, status: :unprocessable_entity
    end
  end

  def multi_destroy
    selected_rows = params['selected_rows']
    if selected_rows.length > 0
      selected_rows.each do |id|
        Transaction.find(id).delete
      end
      render json: {
        data: "Selected transactions successfully deleted."
      }
    else
      render json: {
        data: "No selected rows."
      }, status: :unprocessable_entity
    end
  end

  def update
    transaction = Transaction.find(params['id'])
    if transaction.update(transaction_params)
      render json: {
        data: "Transaction successfully updated."
    }
    else
      render json: {
        data: "Cannot update."
      }, status: :unprocessable_entity
    end
  end

  private

  def transaction_params
    params.require(:transaction).permit(:transaction_date, :account_id, :payee, :category_id, :description, :amount_out, :selected_rows)
  end
end
