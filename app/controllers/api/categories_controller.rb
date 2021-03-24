class Api::CategoriesController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    categories = Category.all
    render json: categories
  end

  def create
    category = Category.new(category_params)
    if category.save
      render json: category
    else
      render json: {
        data: category.errors
      }, status: :unprocessable_entity
    end
  end

 private

  def category_params
    params.require(:category).permit(:name)
  end
end
