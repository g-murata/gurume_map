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
      evaluation: params.evaluation,
      review: params.review,
      lat: params.lat,
      lng: params.lng,
      email: params.email,
    }
  )
    .then(res => {
      console.log(res)
      return res.data
    })
    .catch((e) => { throw e; })
};

export const updateRestraunt = (params) => {
  return axios.patch(`${restaurant(params.id)}`,
    {
      name: params.name,
      evaluation: params.evaluation,
      review: params.review,
    }
  )
    .then(res => {
      console.log(res)
      return res.data
    })
    .catch((e) => { throw e; })
};
