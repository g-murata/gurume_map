// const DEFAULT_API_LOCALHOST = 'http://localhost:3001/api/v1'
const DEFAULT_API_LOCALHOST = "http://localhost:3001/api/v1";


export const restaurants = `${DEFAULT_API_LOCALHOST}/restraunts`
export const restaurant = (restaurantId) => `${DEFAULT_API_LOCALHOST}/restraunts/${restaurantId}`
export const reviews = `${DEFAULT_API_LOCALHOST}/reviews`
export const review = (reviewId) => `${DEFAULT_API_LOCALHOST}/reviews/${reviewId}`
export const already_registered_review = `${DEFAULT_API_LOCALHOST}/reviews/already_registered_review`
export const blogsIndex = `${DEFAULT_API_LOCALHOST}/blogs`
export const blogShow = (blogsId) => `${DEFAULT_API_LOCALHOST}/blogs/${blogsId}`
export const get_user = `${DEFAULT_API_LOCALHOST}/users/get_user`
export const createUser = `${DEFAULT_API_LOCALHOST}/users`

// export const blogShow = `${DEFAULT_API_LOCALHOST}/blogs/1`
// export const foodsIndex = (restaurantId) =>
//   `${DEFAULT_API_LOCALHOST}/restaurants/${restaurantId}/foods`
// export const lineFoods = `${DEFAULT_API_LOCALHOST}/line_foods`;
// export const lineFoodsReplace = `${DEFAULT_API_LOCALHOST}/line_foods/replace`;
// export const orders = `${DEFAULT_API_LOCALHOST}/orders`;
