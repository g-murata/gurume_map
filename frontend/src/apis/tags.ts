import axios from 'axios';
import { tags } from '../urls/index';
import { Tag } from '../types/index';

export const fetchTags = (): Promise<{ tags: Tag[] }> => {
  return axios.get(tags)
    .then(res => {
      return res.data
    })
    .catch((e) => {
      console.error(e);
      throw e;
    })
}
