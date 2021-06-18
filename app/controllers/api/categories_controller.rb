class Api::CategoriesController < ApplicationController

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

  def update
    category = Category.find(params['id'])
    if category.update(category_params)
      render json: {
        data: "Category successfully updated."
    }
    else
      render json: {
        data: category.errors
      }, status: :unprocessable_entity
    end
  end
  
  def destroy
    category = Category.find(params['id'])
    if category.destroy
      render json: {
        data: "Category successfully deleted."
      }
    else
      render json: {
        data: "Cannot delete."
      }, status: :unprocessable_entity
    end
  end

  private

  def category_params
    params.require(:category).permit(:name)
  end
end
