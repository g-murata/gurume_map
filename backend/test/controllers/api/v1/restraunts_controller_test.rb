require "test_helper"

class Api::V1::RestrauntsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)
    @area = areas(:shimbashi)
    @restraunt = restraunts(:ramen_shop)
  end

  test "GET index: レストラン一覧が取得できること" do
    get api_v1_restraunts_url
    assert_response :success

    json_response = JSON.parse(response.body)
    assert json_response.key?("restraunts")
    assert_equal 1, json_response["restraunts"].length
    
    first_restaurant = json_response["restraunts"][0]["restaurant"]
    assert_equal @restraunt.name, first_restaurant["name"]
    assert json_response["restraunts"][0].key?("tags_tagged_items")
  end

  test "POST create: 新しいレストランを作成できること" do
    assert_difference("Restraunt.count", 1) do
      post api_v1_restraunts_url, params: {
        name: "新しくオープンしたお店",
        lat: 35.7,
        lng: 139.8,
        area_id: @area.id,
        email: @user.email,
        url: "http://example.com",
        description: "最高です"
      }
    end

    assert_response :success
    json_response = JSON.parse(response.body)
    assert_equal "新しくオープンしたお店", json_response["restraunts"]["name"]
    assert_equal @user.name, json_response["user_name"]
  end

  test "PATCH update: レストラン情報を更新できること" do
    patch api_v1_restraunt_url(@restraunt), params: {
      name: "店名変更しました",
      url: "http://updated.com"
    }

    assert_response :success
    @restraunt.reload
    assert_equal "店名変更しました", @restraunt.name
    assert_equal "http://updated.com", @restraunt.url
  end

  test "DELETE destroy: レストランを削除できること" do
    assert_difference("Restraunt.count", -1) do
      delete api_v1_restraunt_url(@restraunt)
    end

    assert_response :success
  end
end
