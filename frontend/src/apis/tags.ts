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

export const createTag = (params: { name: string }): Promise<Tag> => {
  return axios.post(tags, { tag: params })
    .then(res => res.data)
    .catch(e => {
      console.error(e);
      throw e;
    });
};

export const updateTag = (id: number, params: { name: string }): Promise<Tag> => {
  return axios.put(`${tags}/${id}`, { tag: params })
    .then(res => res.data)
    .catch(e => {
      console.error(e);
      throw e;
    });
};

export const deleteTag = (id: number): Promise<void> => {
  return axios.delete(`${tags}/${id}`)
    .then(res => res.data)
    .catch(e => {
      console.error(e);
      throw e;
    });
};
