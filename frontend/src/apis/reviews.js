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

export const postReview = (params) => {
  return axios.post(reviews,
    {
      evaluation: params.evaluation,
      content: params.content,
      restraunt_id: params.restraunt_id
    }
  )
    .then(res => {
      console.log(res)
      return res.data
    })
    .catch((e) => { throw e; })
};
