import axios from 'axios';

// Dev ve prod için doğru baseURL/headers seçimi
const baseURL = import.meta.env.PROD ? '/api/trefle' : '/trefle';
const defaultHeaders = import.meta.env.PROD
  ? {}
  : { Authorization: `Bearer ${import.meta.env.VITE_TREFLE_TOKEN}` };

const api = axios.create({
  baseURL,
  headers: defaultHeaders,
});

export const getPlants = async (query = '', page = 1) => {
  try {
    const response = await api.get('/plants/search', {
      params: { q: query, page },
    });
    return response.data;
  } catch (error) {
    console.error('Trefle API hatası:', error);
    return null;
  }
};

export const getPlantDetails = async (id) => {
  try {
    const response = await api.get(`/plants/${id}`);
    return response.data;
  } catch (error) {
    console.error('Bitki detayları alınamadı:', error);
    return null;
  }
};

export const getAllPlants = async (page = 1) => {
  try {
    const response = await api.get('/plants', { params: { page } });
    return response.data;
  } catch (error) {
    console.error('Bitkiler alınamadı:', error);
    return null;
  }
};
