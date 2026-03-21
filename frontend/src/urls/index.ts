const DEFAULT_API_LOCALHOST = process.env.REACT_APP_RAILS_API_ENDPOINT;

export const restaurants = `${DEFAULT_API_LOCALHOST}/restraunts`;
export const restaurant = (restaurantId: number | string) => `${DEFAULT_API_LOCALHOST}/restraunts/${restaurantId}`;
export const reviews = `${DEFAULT_API_LOCALHOST}/reviews`;
export const review = (reviewId: number | string) => `${DEFAULT_API_LOCALHOST}/reviews/${reviewId}`;
export const check_users_without_review = `${DEFAULT_API_LOCALHOST}/reviews/check_users_without_review`;
export const get_latest_reviews = `${DEFAULT_API_LOCALHOST}/reviews/get_latest_reviews`;
export const blogsIndex = `${DEFAULT_API_LOCALHOST}/blogs`;
export const blogShow = (blogsId: number | string) => `${DEFAULT_API_LOCALHOST}/blogs/${blogsId}`;
export const get_user = `${DEFAULT_API_LOCALHOST}/users/get_user`;
export const createUser = `${DEFAULT_API_LOCALHOST}/users`;
export const tags = `${DEFAULT_API_LOCALHOST}/tags`;
export const areas = `${DEFAULT_API_LOCALHOST}/areas`;
export const tags_tagged_items = `${DEFAULT_API_LOCALHOST}/tags_tagged_items`;
export const tags_tagged_item = (tags_tagged_itemId: number | string) => `${DEFAULT_API_LOCALHOST}/tags_tagged_items/${tags_tagged_itemId}`;
