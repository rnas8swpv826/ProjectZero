# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

Transaction.create(
  transaction_date: Date.today - 7,
  payee: 'Costco',
  description: 'Croissants',
  amount_out: 13.99
)

Transaction.create(
  transaction_date: Date.today - 2,
  payee: 'Farm Boy',
  description: 'Apples',
  amount_out: 4
)
