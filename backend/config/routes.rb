Rails.application.routes.draw do
  devise_for :users
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"

  namespace :api do
    namespace :v1 do
      resources :restraunts
      resources :reviews do
        collection do
          get 'check_users_without_review'
          get 'get_latest_reviews'
        end
      end
      resources :blogs      
      resources :users  do
        collection do
          get 'get_user'
        end
      end  
      resources :tags, only: [:index]                
      resources :tags_tagged_items, only: [:create, :destroy]                
    end 
  end   
end
