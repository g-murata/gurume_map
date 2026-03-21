import axios from 'axios';
import { tags_tagged_items, tags_tagged_item } from '../urls/index';
import { TagsTaggedItem } from '../types/index';

export interface PostTagsTaggedItemParams {
  tagged_item_type: string;
  tagged_item_id: number;
  tag_id: number;
}

export const postTagsTaggedItem = (params: PostTagsTaggedItemParams): Promise<{ tags_tagged_item: TagsTaggedItem }> => {
  return axios.post(tags_tagged_items,
    {
      tagged_item_type: params.tagged_item_type,
      tagged_item_id: params.tagged_item_id,
      tag_id: params.tag_id,
    }
  )
    .then(res => {
      return res.data
    })
    .catch((e) => { throw e; })
};

export const deleteTagsTaggedItem = (params: { tagged_item_id: number }): Promise<any> => {
  return axios.delete(`${tags_tagged_item(params.tagged_item_id)}`)
    .then(res => {
      return res.data
    })
    .catch((e) => { throw e; })
};
