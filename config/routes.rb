Rails.application.routes.draw do
  # Devise routes
  devise_for :users

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/*
  get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker
  get "manifest" => "rails/pwa#manifest", as: :pwa_manifest

  # Public routes (unauthenticated)
  get "home/index"
  unauthenticated do
    root "home#index"
  end

  # Authenticated routes
  authenticated :user do
    root "dashboard#index", as: :authenticated_root
  end

  resources :deliveries
  get "dashboard/index"
end
