# Areaデータの作成
areas = [
  { id: 1, name: "新橋" },
  { id: 2, name: "赤坂見附" },
  { id: 3, name: "新宿" },
  { id: 4, name: "王子" }
]

areas.each do |area_data|
  Area.find_or_create_by!(id: area_data[:id]) do |a|
    a.name = area_data[:name]
  end
end

# ユーザーデータの作成
user = User.find_or_create_by!(email: "guest@guest.co.jp") do |u|
  u.name = "ゲスト太郎"
  u.password = "uso_no_password" # コレでログインしてね★
end

user1 = User.find_or_create_by!(email: "testuser@test.co.jp") do |u|
  u.name = "テスト太郎１"
  u.password = "uso_no_password" # コレでログインしてね★
end

user2 = User.find_or_create_by!(email: "hogehoge@hoge.co.jp") do |u|
  u.name = "ほげほげ君"
  u.password = "uso_no_password" # コレでログインしてね★
end

# レストランデータの作成
restaurant = Restraunt.find_or_create_by!(name: "テストレストラン") do |r|
  r.lat = "35.66587105141782"
  r.lng = "139.7545815170528"
  r.user_id = user1.id
  r.area_id = 1 # 新橋
end

# レビューデータの作成
Review.find_or_create_by!(restraunt_id: restaurant.id, user_id: user1.id) do |rv|
  rv.evaluation = 3.5
  rv.content = "うまーーい。"
end

Review.find_or_create_by!(restraunt_id: restaurant.id, user_id: user2.id) do |rv|
  rv.evaluation = 1
  rv.content = "期待外れだね。"
end

# ブログデータの作成
3.times do |n|  
  Blog.find_or_create_by!(title: "サンプル#{n}") do |b|
    b.content = "サンプル_#{n}"
  end
end

# タグデータの作成
tags = [
  { name: "ラーメン", category: "レストラン" },
  { name: "うどん", category: "レストラン" },
  { name: "魚介", category: "レストラン" },
  { name: "居酒屋", category: "レストラン" },
  { name: "肉", category: "レストラン" },
  { name: "パスタ", category: "レストラン" }
]

created_tags = tags.map do |tag_data|
  Tag.find_or_create_by!(name: tag_data[:name]) do |t|
    t.category = tag_data[:category]
  end
end

# タグ付け
TagsTaggedItem.find_or_create_by!(tagged_item_type: "Restraunt", tagged_item_id: restaurant.id, tag_id: created_tags[0].id)
TagsTaggedItem.find_or_create_by!(tagged_item_type: "Restraunt", tagged_item_id: restaurant.id, tag_id: created_tags[2].id)
