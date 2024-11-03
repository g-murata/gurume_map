FactoryBot.define do
  factory :restraunt do
    name { "お店" }
    description { "お店について一言" }
    user {FactoryBot.create(:user)}

    # after(:build) do |restraunt|
    #   restraunt.user_id = FactoryBot.create(:user).id
    # end    
  end
end