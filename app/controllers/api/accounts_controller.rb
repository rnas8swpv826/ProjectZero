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

  def update
    account = Account.find(params['id'])
    if account.update(account_params)
      render json: {
        data: "Account successfully updated."
    }
    else
      render json: {
        data: "Cannot update."
      }, status: :unprocessable_entity
    end
  end
  
  def destroy
    account = Account.find(params['id'])
    if account.destroy
      render json: {
        data: "Account successfully deleted."
      }
    else
      render json: {
        data: "Cannot delete."
      }, status: :unprocessable_entity
    end
  end

 private

  def account_params
    params.require(:account).permit(:name)
  end
end
