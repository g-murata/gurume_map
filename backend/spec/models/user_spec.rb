require 'rails_helper'

RSpec.describe User, type: :model do
  specify "正常" do
    user = FactoryBot.build(:user)
    expect(user).to be_valid
  end

  specify "店名がnilの場合、異常" do
    user = FactoryBot.build(:user)
    user.name = nil
    expect(user).not_to be_valid
    expect(user.errors[:name].size).to eq(1)
    expect(user.errors[:name]).to include("can't be blank") 
  end

end