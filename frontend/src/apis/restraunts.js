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
  return axios.post(restaurants,
    {
      name: params.name,
      lat: params.lat,
      lng: params.lng,
      email: params.email,
      url: params.url,
      description: params.description,
      area_id: params.area_id,
    }
  )
    .then(res => {
      return res.data
    })
    .catch((e) => { throw e; })
};

export const updateRestraunt = (params) => {
  return axios.patch(`${restaurant(params.id)}`,
    {
      name: params.name,
      url: params.url,
      description: params.description,
    }
  )
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
