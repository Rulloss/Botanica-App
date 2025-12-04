import axios from 'axios';

// Vite dev proxy kullanımı: baseURL '/trefle' olarak ayarlanır
const api = axios.create({
  baseURL: '/trefle',
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TREFLE_TOKEN}`,
  },
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
