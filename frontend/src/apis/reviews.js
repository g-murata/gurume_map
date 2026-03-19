import axios from 'axios';
import { reviews, review, check_users_without_review, get_latest_reviews } from '../urls/index'

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
  const formData = new FormData();
  formData.append('evaluation', params.evaluation);
  formData.append('content', params.content);
  formData.append('restraunt_id', params.restraunt_id);
  formData.append('email', params.email);
  if (params.image) {
    formData.append('image', params.image);
  }

  return axios.post(reviews, formData)
    .then(res => {
      return res.data
    })
    .catch((e) => { throw e; })
};

export const updateReview = (params) => {
  const formData = new FormData();
  formData.append('evaluation', params.evaluation);
  formData.append('content', params.content);
  if (params.image) {
    formData.append('image', params.image);
  }

  return axios.patch(`${review(params.id)}`, formData)
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

export const CheckUsersWithoutReviews = (params) => {
  return axios.get(check_users_without_review, {
    params: {
      restraunt_id: params.restraunt_id,
      email: params.email
    }
  })
    .then(res => {
      return res.data
    })
    .catch((e) => { throw e; })
};

export const GetLatestReviews = (params) => {
  return axios.get(get_latest_reviews)
    .then(res => {
      return res.data
    })
    .catch((e) => console.error(e))
};
