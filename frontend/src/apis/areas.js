import axios from 'axios';
import { areas } from '../urls/index'

export const fetchAreas = () => {
  return axios.get(areas)
    .then(res => {
      return res.data
    })
    .catch((e) => console.error(e))
}
