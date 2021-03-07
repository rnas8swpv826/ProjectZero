class Api::TransactionsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index # index is a method
    transactions = Transaction.all
    render json: transactions
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

  private

  def transaction_params
    params.require(:transaction).permit(:payee, :description, :amount_out, :selected_rows, :transaction_date)
  end
end
