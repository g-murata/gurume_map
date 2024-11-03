require 'rails_helper'

RSpec.describe Restraunt, type: :model do
  specify "正常" do
    restraunt = FactoryBot.build(:restraunt)
    expect(restraunt).to be_valid
  end

  specify "店名がnilの場合、異常" do
    restraunt = FactoryBot.build(:restraunt)
    restraunt.name = nil
    expect(restraunt).not_to be_valid
    expect(restraunt.errors[:name].size).to eq(1)
    expect(restraunt.errors[:name]).to include("can't be blank") 
  end

  specify "店名は100文字以内" do
    restraunt = FactoryBot.build(:restraunt)
    restraunt.name = "a" * 101
    expect(restraunt).not_to be_valid
    expect(restraunt.errors[:name].size).to eq(1)
    expect(restraunt.errors[:name]).to include("is too long (maximum is 100 characters)") 
    restraunt.name = "a" * 100
    expect(restraunt).to be_valid    
  end

  specify "説明は100文字以内" do
    restraunt = FactoryBot.build(:restraunt)
    restraunt.description = "a" * 101
    expect(restraunt).not_to be_valid
    expect(restraunt.errors[:description].size).to eq(1)
    expect(restraunt.errors[:description]).to include("is too long (maximum is 100 characters)") 
  end
end