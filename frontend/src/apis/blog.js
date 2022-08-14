import axios from 'axios';
import { blogShow } from '../urls/index'

export const fetchBlog = (blogsId) => {
  return axios.get(blogShow(blogsId))
    .then(res => {
      return res.data
    })
    .catch((e) => console.error(e))
}
