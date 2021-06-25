Rails.application.routes.draw do
  namespace :api do
    resources :transactions
    delete '/transactions', to: 'transactions#multi_destroy' # Change default action for delete method
    resources :categories
    resources :accounts
  end
  root 'homepage#index'
  get '/*path' => 'homepage#index'
end
