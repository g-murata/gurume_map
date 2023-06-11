import axios from 'axios';
import { tags } from '../urls/index'

export const fetchTags = () => {
  return axios.get(tags)
    .then(res => {
      return res.data
    })
    .catch((e) => console.error(e))
}
