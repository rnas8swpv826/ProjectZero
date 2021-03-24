class Api::AccountsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    accounts = Account.all
    render json: accounts
  end

  def create
    account = Account.new(account_params)
    if account.save
      render json: account
    else
      render json: {
        data: account.errors
      }, status: :unprocessable_entity
    end
  end

 private

  def account_params
    params.require(:account).permit(:name)
  end
end
