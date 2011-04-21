RailsTodo::Application.routes.draw do
  resources :todos

  root :to => "todos#home"
end
