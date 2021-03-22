class Transaction < ApplicationRecord
  validates :payee, presence: true
  validates :amount_out, presence: true
  validates :transaction_date, presence: true
  belongs_to :category
  belongs_to :account
end
