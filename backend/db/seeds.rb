# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

user = User.create(name: "ゲスト太郎", email: "guest@guest.co.jp", password: "uso_no_password")
user1 = User.create(name: "テスト太郎１", email: "testuser@test.co.jp", password: "uso_no_password")
user2 = User.create(name: "ほげほげ君", email: "hogehoge@hoge.co.jp", password: "uso_no_password")

restraunts = Restraunt.create(
  name: "テストレストラン",
  image: "https://2.bp.blogspot.com/-NSxv59ZcJfA/VpjCbp0555I/AAAAAAAA3AM/jVD3WGXyRlU/s800/group_kids.png",
  lat: "35.66587105141782",
  lng: "139.7545815170528",
  user_id: user1.id,
)

review = Review.create(
  evaluation: 3.5,
  content: "うまーーい。",
  user_id: user1.id,
  restraunt_id: restraunts.id
)
review = Review.create(
  evaluation: 1,
  content: "期待外れだね。",
  user_id: user2.id,
  restraunt_id: restraunts.id
)


3.times do |n|  
  blogs = Blog.new(
    title: "サンプル#{n}",
    content: "サンプル_#{n}",
    image: "https://2.bp.blogspot.com/-NSxv59ZcJfA/VpjCbp0555I/AAAAAAAA3AM/jVD3WGXyRlU/s800/group_kids.png"
  )
  blogs.save!
  
end
