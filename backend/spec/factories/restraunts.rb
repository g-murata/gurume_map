FactoryBot.define do
  factory :restraunt do
    name { "お店" }
    description { "お店について一言" }
    user {create(:user)}

    # after(:build) do |restraunt|
    #   restraunt.user_id = create(:user).id
    # end    
  end
end