import axios from 'axios';
import { blogsIndex } from '../urls/index';
import { Blog } from '../types/index';

export const fetchBlogs = (): Promise<{ blogs: Blog[] }> => {
  return axios.get(blogsIndex)
    .then(res => {
      return res.data
    })
    .catch((e) => {
      console.error(e);
      throw e;
    })
}
