# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

3.times do |n|
  restraunts = Restraunt.new(
    name: "テストレストラン_#{n}",
    evaluation: 3,
    review: "hoge\nhogehoge",
    image: "https://media.istockphoto.com/vectors/stamprsimp2red-vector-id1096052566?k=20&m=1096052566&s=612x612&w=0&h=CPU7LLHBwJm2OKoXCLxqKDzGaR0Xa1WGTQoryfdWQ3g=",
    lat: "3#{n}.66702060417376",
    lng: "13#{n}.75487166876127"    
  )
  restraunts.save!

  blogs = Blog.new(
    title: "ほげほげ〜#{n}",
    content: "ほげほげ_#{n}",
    image: "https://media.istockphoto.com/vectors/stamprsimp2red-vector-id1096052566?k=20&m=1096052566&s=612x612&w=0&h=CPU7LLHBwJm2OKoXCLxqKDzGaR0Xa1WGTQoryfdWQ3g="
  )
  restraunts.save!  
  blogs.save!
  
end
