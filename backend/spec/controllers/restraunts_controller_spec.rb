require 'rails_helper'

RSpec.describe Api::V1::RestrauntsController, type: :request  do
  let(:restaurant) { create(:restraunt) } 

  # 一覧
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

  # 登録
  describe "POST #create" do
    let(:valid_attributes) { { name: 'テストなお店', description: 'Postのテスト', user: create(:user) } }
    let(:invalid_attributes) { { name: '', description: '', user_id: '' } }

    context "with valid attributes" do
      it "creates a new post" do
        expect {
          post "/api/v1/restraunts", params: { restraunt: valid_attributes }
        }.to change(Restraunt, :count).by(1)
      end
    end

    context "with invalid attributes" do
      it "does not create a new post" do
        expect {
          post "/api/v1/restraunts", params: { your_model: invalid_attributes }
        }.to_not change(Restraunt, :count)
        
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end


  # 更新
  describe "PATCH /api/v1/restraunts/:id" do
    # let(:existing_record) { YourModel.create(attribute1: 'old_value', attribute2: 'old_value2') }
    let(:valid_attributes) { { name: 'テストなお店', description: 'Postのテスト'} }
    let(:invalid_attributes) { { name: '', description: ''} }

    context "with valid parameters" do
      it "updates the record" do
        patch "/api/v1/restraunts/#{restaurant.id}", params: { your_model: valid_attributes }

        expect(response).to have_http_status(:ok)
        expect(restaurant.reload.name).to eq('テストなお店')
      end
    end

    context "with invalid parameters" do
      it "does not update the record" do
        patch "/api/v1/restraunts/#{restaurant.id}", params: { your_model: invalid_attributes }

        expect(response).to have_http_status(:unprocessable_entity)
        expect(restaurant.reload.name).to eq(restaurant.name) # 変更されないことを確認
      end
    end
  end


  # 削除
  describe "DELETE /api/v1/restraunts/:id" do
    # let!(:record_to_delete) { YourModel.create(attribute1: 'value1', attribute2: 'value2') }

    it "deletes the record" do
      expect {
        delete "/api/v1/restraunts/#{restaurant.id}"
      }.to change(Restraunt, :count).by(-1)

      expect(response).to have_http_status(:no_content)
    end

    it "returns not found for non-existing record" do
      expect {
        delete "/api/v1/restraunts/1000" # 存在しないID
      }.to_not change(Restraunt, :count)

      expect(response).to have_http_status(:not_found)
    end
  end

end
