# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

user = User.create(email: "guest@guest.co.jp", password: "uso_no_password")

restraunts = Restraunt.create(
  name: "テストレストラン",
  evaluation: 3.5,
  review: "hoge\nhogehoge",
  image: "https://2.bp.blogspot.com/-NSxv59ZcJfA/VpjCbp0555I/AAAAAAAA3AM/jVD3WGXyRlU/s800/group_kids.png",
  lat: "35.66587105141782",
  lng: "139.7545815170528",
  user_id: user.id
)

3.times do |n|  
  blogs = Blog.new(
    title: "サンプル#{n}",
    content: "サンプル_#{n}",
    image: "https://2.bp.blogspot.com/-NSxv59ZcJfA/VpjCbp0555I/AAAAAAAA3AM/jVD3WGXyRlU/s800/group_kids.png"
  )
  blogs.save!
  
end
