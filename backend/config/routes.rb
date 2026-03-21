Rails.application.routes.draw do
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
      resources :users, only: [:index, :create, :update] do
        collection do
          get 'get_user'
        end
      end  
      resources :tags, only: [:index]                
      resources :areas, only: [:index]                
      resources :tags_tagged_items, only: [:index, :create, :destroy]                
    end 
  end   
end
