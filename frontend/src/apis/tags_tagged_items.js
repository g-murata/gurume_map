import axios from 'axios';
import { tags_tagged_item } from '../urls/index'


export const postTagsTaggedItem = (params) => {
  return axios.post(tags_tagged_item,
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

// export const updateRestraunt = (params) => {
//   return axios.patch(`${restaurant(params.id)}`,
//     {
//       name: params.name
//     }
//   )
//     .then(res => {
//       return res.data
//     })
//     .catch((e) => { throw e; })
// };

// export const deleteRestraunt = (params) => {

//   return axios.delete(`${restaurant(params.id)}`,
//     {
//       id: params.id
//     }
//   )
//     .then(res => {
//       return res.data
//     })
//     .catch((e) => { throw e; })
// };
