// Trefle API servisi
// https://trefle.io/ adresinden ücretsiz API anahtarı alabilirsiniz
import * as trefleApi from './trefle.js';

// Artık API anahtarı ve URL'leri trefle.js'den alıyoruz
// .env dosyasında VITE_TREFLE_TOKEN değişkeni tanımlanmıştır

// API ve örnek veri yanıtlarını tek forma dönüştürmek için yardımcı fonksiyonlar
function normalizePlant(p) {
  if (!p) return null;
  return {
    id: p.id,
    common_name: p.common_name ?? null,
    scientific_name: p.scientific_name ?? null,
    image_url: p.image_url ?? (Array.isArray(p.images) ? p.images[0]?.url : null) ?? null,
    // family alanı API'de nesne olarak gelebilir: { id, name, common_name, ... }
    family: typeof p.family === 'string' ? p.family : (p.family?.name ?? null),
    family_common_name: p.family?.common_name ?? p.family_common_name ?? null,
    // genus alanı da nesne olabilir: { id, name, slug, ... }
    genus: typeof p.genus === 'string' ? p.genus : (p.genus?.name ?? null),
    year: p.year ?? null,
    author: p.author ?? null,
    bibliography: p.bibliography ?? null,
    observations: p.observations ?? null,
    vegetable: typeof p.vegetable === 'boolean' ? p.vegetable : false,
    edible: typeof p.edible === 'boolean' ? p.edible : false,
  };
}

function normalizeListResponse(apiResponse) {
  const data = Array.isArray(apiResponse?.data) ? apiResponse.data.map(normalizePlant) : [];
  return {
    data,
    meta: apiResponse?.meta || { total: data.length, current_page: 1 },
    links: apiResponse?.links || {},
  };
}

// Örnek veri - API hatası durumunda kullanılacak
const SAMPLE_PLANTS = [
  {
    id: 1,
    common_name: "API HATASI",
    scientific_name: "Bitki Bulunamadı..",
    family: "Aile Bulunamadı..",
    genus: "Cins Bulunamadı..",
    image_url: "",
    year: 1753,
    author: "Bulunamadı..",
    family_common_name: "Bulunamadı..",
    observations: "Bulunamadı..",
    vegetable: false,
    edible: false
  },
];


export default {
  /**
   * Bitki adına göre arama yapar
   * @param {string} query - Aranacak bitki adı
   * @param {number} page - Sayfa numarası
   * @returns {Promise} - API yanıtı
   */
  async searchPlants(query, page = 1) {
    try {
      // Trefle API'den bitkileri ara
      const result = await trefleApi.getPlants(query, page);
      
      if (result && result.data && result.data.length > 0) {
        console.log("Canlı API verileri kullanılıyor");
        return normalizeListResponse(result);
      } else {
        console.log("API sonuç bulunamadı, örnek veriler kullanılıyor");
        const filteredPlants = SAMPLE_PLANTS.filter(plant => 
          plant.common_name?.toLowerCase().includes(query.toLowerCase()) || 
          plant.scientific_name?.toLowerCase().includes(query.toLowerCase())
        );
        
        const data = (filteredPlants.length > 0 ? filteredPlants : SAMPLE_PLANTS).map(normalizePlant);
        return {
          data,
          meta: { total: data.length, current_page: 1 },
          links: {},
        };
      }
    } catch (error) {
      console.error('Bitki arama hatası:', error);
      // Hata durumunda tüm örnek verileri göster
      const data = SAMPLE_PLANTS.map(normalizePlant);
      return { data, meta: { total: data.length, current_page: 1 }, links: {} };
    }
  },

  /**
   * Belirli bir bitki ID'sine göre detaylı bilgi alır
   * @param {number} id - Bitki ID'si
   * @returns {Promise} - API yanıtı
   */
  async getPlantDetails(id) {
    try {
      // Trefle API'den bitki detaylarını al
      const result = await trefleApi.getPlantDetails(id);
      
      if (result && result.data) {
        console.log("Canlı API verileri kullanılıyor");
        return { data: normalizePlant(result.data) };
      } else {
        console.log("API sonuç bulunamadı, örnek veriler kullanılıyor");
        const plant = SAMPLE_PLANTS.find(p => p.id === parseInt(id));
        return { data: normalizePlant(plant || SAMPLE_PLANTS[0]) };
      }
    } catch (error) {
      console.error('Bitki detayları getirme hatası:', error);
      // Hata durumunda ilk örnek veriyi göster
      return { data: normalizePlant(SAMPLE_PLANTS[0]) };
    }
  },
  
  // Tüm bitkileri getir
  async getAllPlants(page = 1) {
    try {
      // Trefle API'den tüm bitkileri al
      const result = await trefleApi.getAllPlants(page);
      
      if (result && result.data && result.data.length > 0) {
        console.log("Canlı API verileri kullanılıyor");
        return normalizeListResponse(result);
      } else {
        console.log("API sonuç bulunamadı, örnek veriler kullanılıyor");
        const data = SAMPLE_PLANTS.map(normalizePlant);
        return { data, meta: { total: data.length, current_page: 1 }, links: {} };
      }
    } catch (error) {
      console.error('Bitkiler alınamadı:', error);
      const data = SAMPLE_PLANTS.map(normalizePlant);
      return { data, meta: { total: data.length, current_page: 1 }, links: {} };
    }
  },
  
  /**
   * Belirli bir familyaya ait bitkileri getirir
   * @param {string} family - Bitki familyası
   * @param {number} page - Sayfa numarası
   * @returns {Promise} - API yanıtı
   */
  async getPlantsByFamily(family, page = 1) {
    try {
      // CORS sorunu nedeniyle doğrudan örnek verileri kullanıyoruz
      console.log('Örnek veriler kullanılıyor (CORS sorunu nedeniyle)');
      const filteredPlants = SAMPLE_PLANTS.filter(plant => 
        plant.family.toLowerCase() === family.toLowerCase()
      );
      
      return {
        data: filteredPlants.length > 0 ? filteredPlants : SAMPLE_PLANTS,
        total: filteredPlants.length > 0 ? filteredPlants.length : SAMPLE_PLANTS.length,
        currentPage: 1,
        totalPages: 1
      };
    } catch (error) {
      console.error('Aile bazında bitki getirme hatası:', error);
      return {
        data: SAMPLE_PLANTS,
        total: SAMPLE_PLANTS.length,
        currentPage: 1,
        totalPages: 1
      };
    }
  },
  
  /**
   * Belirli bir cinse ait bitkileri getirir
   * @param {string} genus - Bitki cinsi
   * @param {number} page - Sayfa numarası
   * @returns {Promise} - API yanıtı
   */
  async getPlantsByGenus(genus, page = 1) {
    try {
      // CORS sorunu nedeniyle doğrudan örnek verileri kullanıyoruz
      console.log('Örnek veriler kullanılıyor (CORS sorunu nedeniyle)');
      const filteredPlants = SAMPLE_PLANTS.filter(plant => 
        plant.genus.toLowerCase() === genus.toLowerCase()
      );
      
      return {
        data: filteredPlants.length > 0 ? filteredPlants : SAMPLE_PLANTS,
        total: filteredPlants.length > 0 ? filteredPlants.length : SAMPLE_PLANTS.length,
        currentPage: 1,
        totalPages: 1
      };
    } catch (error) {
      console.error('Cins bazında bitki getirme hatası:', error);
      return {
        data: SAMPLE_PLANTS,
        total: SAMPLE_PLANTS.length,
        currentPage: 1,
        totalPages: 1
      };
    }
  }
};
