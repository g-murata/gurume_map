import axios from 'axios';
import { blogsIndex } from '../urls/index'

export const fetchBlogs = () => {
  return axios.get(blogsIndex)
    .then(res => {
      return res.data
    })
    .catch((e) => console.error(e))
}
