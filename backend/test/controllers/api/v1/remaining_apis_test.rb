require "test_helper"

class Api::V1::RemainingApisTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)
    @restraunt = restraunts(:ramen_shop)
    @blog = blogs(:one)
    @tag = tags(:ramen)
    @area = areas(:shimbashi)
  end

  test "GET reviews: レビュー一覧が取得できること" do
    get api_v1_reviews_url
    assert_response :success
    json = JSON.parse(response.body)
    assert json.key?("reviews")
  end

  test "GET review (show): 特定の店舗のレビューが取得できること" do
    get api_v1_review_url(@restraunt.id)
    assert_response :success
    json = JSON.parse(response.body)
    assert json.key?("review")
  end

  test "POST review: 新しいレビューを投稿できること" do
    assert_difference("Review.count", 1) do
      post api_v1_reviews_url, params: {
        restraunt_id: @restraunt.id,
        evaluation: 4.5,
        content: "とても満足しました",
        email: @user.email
      }
    end
    assert_response :success
  end

  test "GET blogs: ブログ一覧が取得できること" do
    get api_v1_blogs_url
    assert_response :success
    json = JSON.parse(response.body)
    assert json.key?("blogs")
  end

  test "GET tags: タグ一覧が取得できること" do
    get api_v1_tags_url
    assert_response :success
    json = JSON.parse(response.body)
    assert json.key?("tags")
  end

  test "GET areas: エリア一覧が取得できること" do
    get api_v1_areas_url
    assert_response :success
    json = JSON.parse(response.body)
    assert json.key?("areas")
  end

  test "GET user: ユーザー情報が取得できること" do
    get get_user_api_v1_users_url, params: { email: @user.email }
    assert_response :success
    json = JSON.parse(response.body)
    assert_equal @user.name, json["user"]["name"]
  end
end
