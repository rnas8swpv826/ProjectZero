class Api::AccountsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    accounts = Account.all
    render json: accounts
  end
end
