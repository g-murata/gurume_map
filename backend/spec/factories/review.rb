FactoryBot.define do
  factory :review do
    restraunt {create(:restraunt)}
    user {restraunt.user}
    evaluation { 3 }
    content { "とてもおいしい。"}

  end
end