class Transaction < ApplicationRecord
  validates :payee, presence: true
  validates :amount_out, presence: true
end
