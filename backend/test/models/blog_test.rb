require "test_helper"

class BlogTest < ActiveSupport::TestCase
  setup do
    @blog = blogs(:one)
  end

  test "有効なブログであること" do
    assert @blog.valid?
  end

  test "タグとの紐付けが可能であること" do
    assert_equal 1, @blog.tags_tagged_items.count
  end
end
