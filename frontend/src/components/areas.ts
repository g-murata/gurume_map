import { Area } from '../types';
import { auth } from '../firebase';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/v1';

const getAuthHeader = async (): Promise<Record<string, string>> => {
  const user = auth.currentUser;
  if (!user) return {};
  const token = await user.getIdToken();
  return { 'Authorization': `Bearer ${token}` };
}

export const fetchAreas = async (): Promise<{ areas: Area[] }> => {
  const res = await fetch(`${BASE_URL}/areas`);
  if (!res.ok) {
    throw new Error('Failed to fetch areas');
  }
  return res.json();
};

export const createArea = async (params: { name: string }): Promise<Area> => {
  const authHeader = await getAuthHeader();
  const res = await fetch(`${BASE_URL}/areas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader },
    body: JSON.stringify({ area: params }),
  });
  if (!res.ok) {
    throw new Error('Failed to create area');
  }
  return res.json();
};

export const updateArea = async (id: number, params: { name: string }): Promise<Area> => {
  const authHeader = await getAuthHeader();
  const res = await fetch(`${BASE_URL}/areas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader },
    body: JSON.stringify({ area: params }),
  });
  if (!res.ok) {
    throw new Error('Failed to update area');
  }
  return res.json();
};

export const deleteArea = async (id: number): Promise<Response> => {
  const authHeader = await getAuthHeader();
  const res = await fetch(`${BASE_URL}/areas/${id}`, {
    method: 'DELETE',
    headers: { ...authHeader },
  });
  if (!res.ok) {
    throw new Error('Failed to delete area');
  }
  return res;
};
