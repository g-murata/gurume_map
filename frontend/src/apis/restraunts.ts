import axios from 'axios';
import { restaurants, restaurant } from '../urls/index';
import { Restraunt } from '../types/index';

export interface PostRestrauntParams {
  name: string;
  lat: number;
  lng: number;
  email: string;
  url?: string;
  description?: string;
  area_id: number;
  image?: File | null;
  evaluation?: number;
  review_content?: string;
  review_image?: File | null;
}

export interface UpdateRestrauntParams {
  id: number;
  name: string;
  url?: string;
  description?: string;
  image?: File | null;
  delete_image?: boolean;
}

export const fetchRestaurants = (): Promise<{ restraunts: Restraunt[] }> => {
  return axios.get(restaurants)
    .then(res => {
      return res.data
    })
    .catch((e) => {
      console.error(e);
      throw e;
    })
}

export const postRestraunt = (params: PostRestrauntParams): Promise<{ restraunt: Restraunt }> => {
  const formData = new FormData();
  formData.append('name', params.name);
  formData.append('lat', String(params.lat));
  formData.append('lng', String(params.lng));
  formData.append('email', params.email);
  if (params.url) formData.append('url', params.url);
  if (params.description) formData.append('description', params.description);
  formData.append('area_id', String(params.area_id));
  if (params.image) {
    formData.append('image', params.image);
  }
  if (params.evaluation) {
    formData.append('evaluation', String(params.evaluation));
  }
  if (params.review_content) {
    formData.append('review_content', params.review_content);
  }
  if (params.review_image) {
    formData.append('review_image', params.review_image);
  }

  return axios.post(restaurants, formData)
    .then(res => {
      return res.data
    })
    .catch((e) => { throw e; })
};

export const updateRestraunt = (params: UpdateRestrauntParams): Promise<{ restraunt: Restraunt }> => {
  const formData = new FormData();
  formData.append('name', params.name);
  if (params.url) formData.append('url', params.url);
  if (params.description) formData.append('description', params.description);
  if (params.image) {
    formData.append('image', params.image);
  }
  if (params.delete_image) {
    formData.append('delete_image', String(params.delete_image));
  }

  return axios.patch(`${restaurant(params.id)}`, formData)
    .then(res => {
      return res.data
    })
    .catch((e) => { throw e; })
};

export const deleteRestraunt = (params: { id: number }): Promise<any> => {
  return axios.delete(`${restaurant(params.id)}`)
    .then(res => {
      return res.data
    })
    .catch((e) => { throw e; })
};
