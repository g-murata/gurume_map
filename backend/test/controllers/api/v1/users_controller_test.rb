require "test_helper"

class Api::V1::UsersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)
  end

  test "get_user: 既存のユーザー情報を取得できること" do
    get get_user_api_v1_users_url, params: { email: @user.email }
    assert_response :success
    json = JSON.parse(response.body)
    assert_equal @user.id, json["user"]["id"]
    assert_equal @user.email, json["user"]["email"]
    assert_not_nil json["user"]["reviews_count"]
    assert_not_nil json["user"]["restraunts_count"]
  end

  test "get_user: ユーザーが存在しない場合、新しく作成されること" do
    new_email = "new_user@example.com"
    
    assert_difference("User.count", 1) do
      get get_user_api_v1_users_url, params: { email: new_email }
    end
    
    assert_response :success
    json = JSON.parse(response.body)
    assert_equal new_email, json["user"]["email"]
    # 名前がメールアドレスの@前（new_user）になっていること
    assert_equal "new_user", json["user"]["name"]
  end

  test "get_user: ユーザー作成時に名前が指定されている場合、その名前で作成されること" do
    new_email = "named_user@example.com"
    display_name = "カスタム名前"
    
    assert_difference("User.count", 1) do
      get get_user_api_v1_users_url, params: { email: new_email, name: display_name }
    end
    
    assert_response :success
    json = JSON.parse(response.body)
    assert_equal display_name, json["user"]["name"]
  end
end
