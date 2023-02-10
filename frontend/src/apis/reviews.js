import axios from 'axios';
import { reviews, review } from '../urls/index'

export const fetchReviews = () => {
  return axios.get(reviews)
    .then(res => {
      return res.data
    })
    .catch((e) => console.error(e))
}


export const fetchShowReview = (params) => {
  return axios.get(review(params))
    .then(res => {
      return res.data
    })
    .catch((e) => console.error(e))
};
