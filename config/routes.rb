Rails.application.routes.draw do
  namespace :api do
    resources :transactions
    delete '/transactions', to: 'transactions#multi_destroy' # creates a new route
    resources :categories
    resources :accounts
  end
  root 'homepage#index' # No "yay you're on rails" page
  get '/*path' => 'homepage#index'
end
