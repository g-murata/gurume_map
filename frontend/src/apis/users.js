import axios from 'axios';
import { get_user, createUser } from '../urls/index'


export const fetchShowUser = (params) => {
  return axios.get(get_user, {
    params: {
      email: params
    }
  }).then(res => {
      return res.data
    })
    .catch((e) => console.error(e))
};

export const postCreateUser = (params) => {
  return axios.post(createUser,
    {
      name: params.name,
      email: params.email,
      password: params.password,
    }
  )
    .then(res => {
      return res.data
    })
    .catch((e) => { throw e; })
};
