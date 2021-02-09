class Transaction < ApplicationRecord
    validates :payee, presence: true
end
