class Category < ApplicationRecord
  validates :name, presence: true, uniqueness: {case_sensitive: false}
  has_many :subcategories, class_name: "Category", foreign_key: "parent_id", dependent: :nullify
  belongs_to :parent, class_name: "Category"
  has_many :transactions
end
