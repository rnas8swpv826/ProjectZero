Rails.application.routes.draw do
  namespace :api do
    resources :transactions
  end
  root 'homepage#index' # No "yay you're on rails" page
end
