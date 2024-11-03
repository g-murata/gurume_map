require 'rails_helper'

RSpec.describe Restraunt, type: :model do
  specify "正常" do
    restraunt = FactoryBot.build(:restraunt)
    expect(restraunt).to be_valid
  end

  context "店名がnilの場合" do
    specify "異常" do
      restraunt = FactoryBot.build(:restraunt)
      restraunt.name = nil
      expect(restraunt).not_to be_valid
      expect(restraunt.errors[:name].size).to eq(1)
      expect(restraunt.errors[:name]).to include("can't be blank") 
    end
  end  

  # context "説明がnilの場合" do
  #   specify "異常" do
  #     restraunt = FactoryBot.build(:restraunt)
  #     restraunt.description = nil
  #     expect(restraunt).not_to be_valid
  #     expect(restraunt.errors[:description].size).to eq(1)
  #     expect(restraunt.errors[:description]).to include("can't be blank") 
  #   end
  # end  
end