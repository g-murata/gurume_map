import axios from 'axios';
import { blogShow } from '../urls/index';
import { Blog } from '../types/index';

export const fetchBlog = (blogsId: number | string): Promise<{ blog: Blog }> => {
  return axios.get(blogShow(blogsId))
    .then(res => {
      return res.data
    })
    .catch((e) => {
      console.error(e);
      throw e;
    })
}
