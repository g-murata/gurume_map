require "test_helper"

class ReviewTest < ActiveSupport::TestCase
  setup do
    @review = reviews(:one)
  end

  test "有効なレビューであること" do
    assert @review.valid?
  end

  test "評価(evaluation)は必須であること" do
    @review.evaluation = nil
    assert_not @review.valid?
  end

  test "評価は0より大きい必要があること" do
    @review.evaluation = 0
    assert_not @review.valid?
  end

  test "評価は5以下の数値であること" do
    @review.evaluation = 5.1
    assert_not @review.valid?
  end

  test "内容は1000文字以内であること" do
    @review.content = "a" * 1001
    assert_not @review.valid?
  end
end
