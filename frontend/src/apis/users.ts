import axios from 'axios';
import { get_user, createUser } from '../urls/index';
import { User } from '../types/index';

export const fetchShowUser = (email: string, name?: string | null): Promise<{ user: User }> => {
  return axios.get(get_user, {
    params: {
      email: email,
      name: name
    }
  }).then(res => {
      return res.data
    })
    .catch((e) => {
      console.error(e);
      throw e;
    })
};

export const postCreateUser = (params: Pick<User, 'name' | 'email'> & { password?: string }): Promise<{ user: User }> => {
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
