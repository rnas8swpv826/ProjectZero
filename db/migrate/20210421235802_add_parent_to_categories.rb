class AddParentToCategories < ActiveRecord::Migration[6.1]
  def change
    add_reference :categories, :parent, index: true
  end
end
