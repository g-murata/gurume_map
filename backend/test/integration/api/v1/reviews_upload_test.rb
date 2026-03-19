require "test_helper"

class Api::V1::ReviewsUploadTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)
    @restaurant = restraunts(:ramen_shop)
    # テスト用の画像ファイルを作成
    @image = fixture_file_upload('test/fixtures/files/test_image.png', 'image/png')
  end

  test "should create review with image" do
    assert_difference("Review.count") do
      post api_v1_reviews_url, params: {
        evaluation: 5,
        content: "画像付きレビューのテストです。最高に美味しい！",
        restraunt_id: @restaurant.id,
        email: @user.email,
        image: @image
      }
    end

    assert_response :success
    json_response = JSON.parse(response.body)
    
    assert_not_nil json_response["review"]["image_url"], "image_url should not be nil"
    assert_match /\/rails\/active_storage\/blobs/, json_response["review"]["image_url"]
    
    # 実際に添付されているかDBレベルで確認
    review = Review.last
    assert review.image.attached?
    assert_equal "test_image.png", review.image.filename.to_s
  end

  test "should update review with new image" do
    review = reviews(:one) # 既存のレビュー（fixtures/reviews.yml に定義されていると想定）
    new_image = fixture_file_upload('test/fixtures/files/test_image.png', 'image/png')

    patch api_v1_review_url(review), params: {
      evaluation: 4,
      content: "画像を差し替えました",
      image: new_image
    }

    assert_response :success
    json_response = JSON.parse(response.body)
    
    assert_not_nil json_response["reviews"]["image_url"]
    
    review.reload
    assert review.image.attached?
  end
end
