require "test_helper"

class UserTest < ActiveSupport::TestCase
  setup do
    @user = users(:one)
    @restaurant = restraunts(:ramen_shop)
  end

  test "reviews_count should return correct count" do
    assert_equal 1, @user.reviews_count
    
    Review.create!(restraunt: @restaurant, user: @user, evaluation: 4, content: "Second review")
    assert_equal 2, @user.reviews_count
  end

  test "restraunts_count should return correct count" do
    # fixture で @user は ramen_shop を持っているはず（user: one）
    assert_equal 1, @user.restraunts_count
    
    Restraunt.create!(name: "New Shop", lat: 35.0, lng: 139.0, user: @user, area: areas(:shimbashi))
    assert_equal 2, @user.restraunts_count
  end
end
