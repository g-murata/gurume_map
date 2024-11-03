FactoryBot.define do
  factory :review do
    restraunt {FactoryBot.create(:restraunt)}
    user {restraunt.user}
    evaluation { 3 }
    content { "とてもおいしい。"}

  end
end