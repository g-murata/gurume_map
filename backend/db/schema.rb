# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2024_12_21_112554) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "areas", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.float "lat"
    t.float "lng"
  end

  create_table "blogs", force: :cascade do |t|
    t.string "title"
    t.string "content"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "image"
  end

  create_table "comments", force: :cascade do |t|
    t.string "comment"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "restraunts", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "image"
    t.float "lat"
    t.float "lng"
    t.bigint "user_id"
    t.string "url"
    t.string "description"
    t.bigint "area_id"
    t.index ["area_id"], name: "index_restraunts_on_area_id"
    t.index ["user_id"], name: "index_restraunts_on_user_id"
  end

  create_table "reviews", force: :cascade do |t|
    t.string "content"
    t.float "evaluation"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "restraunt_id"
    t.bigint "user_id"
    t.index ["restraunt_id"], name: "index_reviews_on_restraunt_id"
    t.index ["user_id"], name: "index_reviews_on_user_id"
  end

  create_table "tags", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "category"
    t.index ["name"], name: "index_tags_on_name"
  end

  create_table "tags_tagged_items", force: :cascade do |t|
    t.string "tagged_item_type", null: false
    t.bigint "tagged_item_id", null: false
    t.bigint "tag_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["tag_id"], name: "index_tags_tagged_items_on_tag_id"
    t.index ["tagged_item_type", "tagged_item_id"], name: "index_tags_tagged_items_on_tagged_item"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "restraunts", "areas"
  add_foreign_key "restraunts", "users"
  add_foreign_key "reviews", "restraunts"
  add_foreign_key "reviews", "users"
  add_foreign_key "tags_tagged_items", "tags"
end
