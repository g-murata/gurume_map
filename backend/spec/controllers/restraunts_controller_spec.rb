require 'rails_helper'

RSpec.describe Api::V1::RestrauntsController, type: :request  do
  let(:restaurant) { FactoryBot.create(:restraunt) } 
  describe "GET #index" do
    it "returns a successful response" do
      restaurant

      get '/api/v1/restraunts'
      json_response = JSON.parse(response.body)
      # レスポンスがハッシュであることを確認
      expect(json_response).to be_a(Hash)
      expect(json_response['restraunts']).to be_an(Array)
      # 各レストランのデータを検証
      first_restaurant = json_response['restraunts'].first
      expect(first_restaurant['restaurant']['id']).to eq(restaurant.id)
      expect(first_restaurant['restaurant']['name']).to eq(restaurant.name)
      
      expect(response).to have_http_status(:success)
    end
  end

  # describe "GET #show" do
  #   it "returns a successful response" do
  #     get :show, params: { id: post.id }
  #     expect(response).to have_http_status(:success)
  #   end
  # end

  # describe "POST #create" do
  #   context "with valid attributes" do
  #     it "creates a new post" do
  #       expect {
  #         post :create, params: { post: attributes_for(:post) }
  #       }.to change(Post, :count).by(1)
  #     end
  #   end

  #   context "with invalid attributes" do
  #     it "does not create a new post" do
  #       expect {
  #         post :create, params: { post: attributes_for(:post, title: nil) }
  #       }.not_to change(Post, :count)
  #     end
  #   end
  # end
end
