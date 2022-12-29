import axios from 'axios';
import { createUser } from '../urls/index'

export const postCreateUser = (params) => {
  console.log(params)
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
