require "test_helper"

class RestrauntTest < ActiveSupport::TestCase

  def setup
    @user = users(:one)
    @area = areas(:shimbashi)
    @restraunt = restraunts(:ramen_shop)
  end

  test "有効なレストランであること" do
    assert @restraunt.valid?
  end

  test "店名が空の場合は無効であること" do
    @restraunt.name = ""
    assert_not @restraunt.valid?
  end

  test "店名が100文字を超える場合は無効であること" do
    @restraunt.name = "a" * 101
    assert_not @restraunt.valid?
  end

  test "説明文が100文字を超える場合は無効であること" do
    @restraunt.description = "a" * 101
    assert_not @restraunt.valid?
  end

  test "ユーザーに紐付いていること" do
    assert_equal @user, @restraunt.user
  end

  test "エリアに紐付いていること" do
    assert_equal @area, @restraunt.area
  end

end
