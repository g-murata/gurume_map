import axios from 'axios';
import { reviews, review, already_registered_review } from '../urls/index'

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
      restraunt_id: params.restraunt_id,
      email: params.email
    }
  )
    .then(res => {
      return res.data
    })
    .catch((e) => { throw e; })
};

export const updateReview = (params) => {
  return axios.patch(`${review(params.id)}`,
    {
      evaluation: params.evaluation,
      content: params.content
    }
  )
    .then(res => {
      return res.data
    })
    .catch((e) => { throw e; })
};

export const deleteReview = (params) => {

  return axios.delete(`${review(params.id)}`,
    {
      id: params.id
    }
  )
    .then(res => {
      return res.data
    })
    .catch((e) => { throw e; })
};

export const alreadyRegisteredReview = (params) => {
  return axios.get(already_registered_review, {
    params: {
      restraunt_id: params.restraunt_id,
      email: params.email
    }
  })
    .then(res => {
      return res.data
    })
    .catch((e) => console.error(e))
};
