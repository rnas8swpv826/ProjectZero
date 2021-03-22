class Api::TransactionsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index # index is a method
    transactions = Transaction.all
    transactions_json = transactions.as_json
    transactions.each_with_index do |transaction, index|
      transactions_json[index]['category_name'] = transaction.category.name
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
    params.require(:transaction).permit(:transaction_date, :payee, :category_id, :description, :amount_out, :selected_rows)
  end
end
