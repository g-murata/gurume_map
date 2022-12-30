import axios from 'axios';
import { restaurants } from '../urls/index'

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
    }
  )
    .then(res => {
      console.log(res)
      return res.data
    })
    .catch((e) => { throw e; })
};
