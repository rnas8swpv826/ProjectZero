class Api::TransactionsController < ApplicationController
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

  private

  def transaction_params
    params.require(:transaction).permit(:payee, :description, :amount_out)
  end
end
