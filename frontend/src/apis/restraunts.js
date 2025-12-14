import axios from 'axios';
import { restaurants, restaurant } from '../urls/index'

export const fetchRestaurants = () => {
  return axios.get(restaurants)
    .then(res => {
      return res.data
    })
    .catch((e) => console.error(e))
}

export const postRestraunt = (params) => {
  // 1. FormDataオブジェクトの作成
  const formData = new FormData();

  // 2. テキストデータと画像データをFormDataに追加
  // Rails側でparams[:restraunt]の中にこれらのデータが入るように、キー名を調整する必要があるかもしれません
  // (例: 'restraunt[name]', 'restraunt[image]')

  formData.append('name', params.name);
  formData.append('lat', params.lat);
  formData.append('lng', params.lng);
  formData.append('email', params.email);
  formData.append('url', params.url);
  formData.append('description', params.description);
  formData.append('area_id', params.area_id);

  // 画像ファイルを追加
  // 'image'というキー名でファイルデータ（params.image）を追加
  if (params.image) {
    formData.append('image', params.image);
  }

  // 3. axiosでFormDataを送信
  return axios.post(restaurants, formData, {
    // 重要な設定: ヘッダーでContent-Typeをmultipart/form-dataに設定（axiosはFormDataを使用すると自動で設定してくれることが多いですが、明示的に指定する場合もあります）
    // headers: {
    //   'Content-Type': 'multipart/form-data',
    // },
  })
    .then(res => {
      return res.data
    })
    .catch((e) => { throw e; })
};

export const updateRestraunt = (params) => {
  return axios.patch(`${restaurant(params.id)}`,
    {
      name: params.name,
      url: params.url,
      description: params.description,
    }
  )
    .then(res => {
      return res.data
    })
    .catch((e) => { throw e; })
};

export const deleteRestraunt = (params) => {

  return axios.delete(`${restaurant(params.id)}`,
    {
      id: params.id
    }
  )
    .then(res => {
      return res.data
    })
    .catch((e) => { throw e; })
};
