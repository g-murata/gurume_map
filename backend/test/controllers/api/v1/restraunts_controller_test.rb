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

  test "POST create: レストランとレビューを同時に作成できること" do
    assert_difference(["Restraunt.count", "Review.count"], 1) do
      post api_v1_restraunts_url, params: {
        name: "レビュー同時投稿のお店",
        lat: 35.7,
        lng: 139.8,
        area_id: @area.id,
        email: @user.email,
        evaluation: 5,
        review_content: "最高のお店を見つけました！"
      }
    end

    assert_response :success
    json_response = JSON.parse(response.body)
    assert_equal "レビュー同時投稿のお店", json_response["restraunts"]["name"]
    
    # 作成されたレビューの内容を確認
    last_review = Review.last
    assert_equal 5, last_review.evaluation
    assert_equal "最高のお店を見つけました！", last_review.content
  end

  test "POST create: デフォルト値（星3, 本文なし）の場合はレビューを作成しないこと" do
    assert_difference("Restraunt.count", 1) do
      assert_no_difference("Review.count") do
        post api_v1_restraunts_url, params: {
          name: "レビューなしのお店",
          lat: 35.7,
          lng: 139.8,
          area_id: @area.id,
          email: @user.email,
          evaluation: 3, # デフォルト値
          review_content: "" # 空
        }
      end
    end
    assert_response :success
  end

  test "POST create: 星評価が変更されている場合はレビューも作成すること" do
    assert_difference(["Restraunt.count", "Review.count"], 1) do
      post api_v1_restraunts_url, params: {
        name: "星4評価のお店",
        lat: 35.7,
        lng: 139.8,
        area_id: @area.id,
        email: @user.email,
        evaluation: 4, # デフォルト以外
        review_content: ""
      }
    end
    assert_response :success
    assert_equal 4, Review.last.evaluation
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
