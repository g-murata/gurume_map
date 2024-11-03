require 'rails_helper'

RSpec.describe Review, type: :model do
  specify "正常" do
    review = FactoryBot.build(:review)
    expect(review).to be_valid
  end

  specify "評価は0以上5未満" do
    review = FactoryBot.build(:review)
    review.evaluation = 0
    expect(review).not_to be_valid
    expect(review.errors[:evaluation].size).to eq(1)
    expect(review.errors[:evaluation]).to include("must be greater than 0") 

    review.evaluation = 6
    expect(review).not_to be_valid
    expect(review.errors[:evaluation].size).to eq(1)
    expect(review.errors[:evaluation]).to include("must be less than or equal to 5") 

  end

end