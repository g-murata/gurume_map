import axios from 'axios';
import { get_user, createUser, updateUser } from '../urls/index';
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

export const patchUpdateUser = (userId: number, name: string, image?: File | null): Promise<{ user: User }> => {
  const formData = new FormData();
  formData.append('name', name);
  if (image) {
    formData.append('image', image);
  }

  return axios.patch(updateUser(userId), formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then(res => res.data)
    .catch((e) => { throw e; });
};
