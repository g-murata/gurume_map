import axios from 'axios';
import { restaurants, restaurant } from '../urls/index'

export const fetchRestaurants = () => {
  return axios.get(restaurants)
    .then(res => {
      return res.data
    })
    .catch((e) => console.error(e))
}

export const postRestraunt = (params) => {
  const formData = new FormData();
  formData.append('name', params.name);
  formData.append('lat', params.lat);
  formData.append('lng', params.lng);
  formData.append('email', params.email);
  formData.append('url', params.url);
  formData.append('description', params.description);
  formData.append('area_id', params.area_id);
  if (params.image) {
    formData.append('image', params.image);
  }

  return axios.post(restaurants, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then(res => {
      return res.data
    })
    .catch((e) => { throw e; })
};

export const updateRestraunt = (params) => {
  const formData = new FormData();
  formData.append('name', params.name);
  formData.append('url', params.url);
  formData.append('description', params.description);
  if (params.image) {
    formData.append('image', params.image);
  }

  return axios.patch(`${restaurant(params.id)}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then(res => {
      return res.data
    })
    .catch((e) => { throw e; })
};

export const deleteRestraunt = (params) => {

  return axios.delete(`${restaurant(params.id)}`,
    {
      id: params.id
    }
  )
    .then(res => {
      return res.data
    })
    .catch((e) => { throw e; })
};
