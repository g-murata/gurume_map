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

export const createArea = (params: { name: string, lat?: number, lng?: number }): Promise<Area> => {
  return axios.post(areas, { area: params })
    .then(res => res.data)
    .catch(e => {
      console.error(e);
      throw e;
    });
};

export const updateArea = (id: number, params: { name: string, lat?: number, lng?: number }): Promise<Area> => {
  return axios.put(`${areas}/${id}`, { area: params })
    .then(res => res.data)
    .catch(e => {
      console.error(e);
      throw e;
    });
};

export const deleteArea = (id: number): Promise<void> => {
  return axios.delete(`${areas}/${id}`)
    .then(res => res.data)
    .catch(e => {
      console.error(e);
      throw e;
    });
};
