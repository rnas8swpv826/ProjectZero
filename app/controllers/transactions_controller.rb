class TransactionsController < ApplicationController
    def index
        transactions = Transaction.all
        render json: transactions
    end
    
    def show
        transaction ||= Transaction.find(params[:id])
        render json: transaction
    end
end
