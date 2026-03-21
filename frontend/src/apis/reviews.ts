import axios from 'axios';
import { reviews, review, check_users_without_review, get_latest_reviews } from '../urls/index';
import { Review } from '../types/index';

export interface PostReviewParams {
  evaluation: number;
  content: string;
  restraunt_id: number;
  email: string;
  image?: File | null;
}

export interface UpdateReviewParams {
  id: number;
  evaluation: number;
  content: string;
  image?: File | null;
  delete_image?: boolean;
}

export const fetchReviews = (): Promise<{ reviews: Review[] }> => {
  return axios.get(reviews)
    .then(res => {
      return res.data
    })
    .catch((e) => {
      console.error(e);
      throw e;
    })
}

export const fetchShowReview = (id: number | string): Promise<{ review: Review }> => {
  return axios.get(review(id))
    .then(res => {
      return res.data
    })
    .catch((e) => {
      console.error(e);
      throw e;
    })
};

export const postReview = (params: PostReviewParams): Promise<{ review: Review }> => {
  const formData = new FormData();
  formData.append('evaluation', String(params.evaluation));
  formData.append('content', params.content);
  formData.append('restraunt_id', String(params.restraunt_id));
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

export const updateReview = (params: UpdateReviewParams): Promise<{ review: Review }> => {
  const formData = new FormData();
  formData.append('evaluation', String(params.evaluation));
  formData.append('content', params.content);
  if (params.image) {
    formData.append('image', params.image);
  }
  if (params.delete_image) {
    formData.append('delete_image', String(params.delete_image));
  }

  return axios.patch(review(params.id), formData)
    .then(res => {
      return res.data
    })
    .catch((e) => { throw e; })
};

export const deleteReview = (params: { id: number }): Promise<any> => {
  return axios.delete(review(params.id))
    .then(res => {
      return res.data
    })
    .catch((e) => { throw e; })
};

export const CheckUsersWithoutReviews = (params: { restraunt_id: number; email: string }): Promise<boolean> => {
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

export const GetLatestReviews = (): Promise<{ reviews: Review[] }> => {
  return axios.get(get_latest_reviews)
    .then(res => {
      return res.data
    })
    .catch((e) => {
      console.error(e);
      throw e;
    })
};
