require "test_helper"

class Api::V1::RestrauntsUploadTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)
    @area = areas(:shimbashi)
    # テスト用の画像ファイルを作成
    @image = fixture_file_upload('test/fixtures/files/test_image.png', 'image/png')
  end

  test "should create restraunt with image" do
    assert_difference("Restraunt.count") do
      post api_v1_restraunts_url, params: {
        name: "画像テスト店",
        lat: 35.0,
        lng: 135.0,
        email: @user.email,
        area_id: @area.id,
        image: @image
      }
    end

    assert_response :success
    json_response = JSON.parse(response.body)
    
    assert_not_nil json_response["restraunts"]["image_url"], "image_url should not be nil"
    assert_match /\/rails\/active_storage\/blobs/, json_response["restraunts"]["image_url"]
    
    # 実際に添付されているか確認
    restraunt = Restraunt.last
    assert restraunt.image.attached?
  end
end
