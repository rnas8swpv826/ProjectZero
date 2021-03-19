class Api::CategoriesController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    categories = Category.all
    render json: categories
  end
end
