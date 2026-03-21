import axios from 'axios';
import { areas } from '../urls/index';
import { Area } from '../types/index';

export const fetchAreas = (): Promise<{ areas: Area[] }> => {
  return axios.get(areas)
    .then(res => {
      return res.data
    })
    .catch((e) => {
      console.error(e);
      throw e;
    })
}
