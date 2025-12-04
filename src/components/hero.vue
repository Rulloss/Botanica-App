<template>
  <div class="hero">
    <h1>Botanica</h1>
    <p class="subtitle">Bitki dünyasını keşfedin</p>
    
    <div class="search-container">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Bitki adı girin..." 
        @keyup.enter="searchPlant"
      />
      <button @click="searchPlant" class="search-button">Ara</button>
    </div>

    <div v-if="loading" class="loading">
      Aranıyor...
    </div>

    <div v-if="error" class="error">
      {{ error }}
    </div>

    <div class="content-container" v-if="showResults && !loading">
      <!-- Arama sonuçları listesi -->
      <div class="search-results">
        <h3>Arama Sonuçları</h3>
        <ul>
          <li v-for="result in searchResults" :key="result.id" @click="showPlantDetails(result.id)" 
              :class="{ active: plant && plant.id === result.id }">
            {{ result.common_name || result.scientific_name }}
          </li>
        </ul>
        <button v-if="currentPage < totalPages" @click="loadMorePlants" class="load-more">
          Daha Fazla Yükle
        </button>
      </div>
      
      <!-- Bitki detayları -->
      <div v-if="plant" class="plant-details">
        <h2>{{ plant.common_name || plant.scientific_name }}</h2>
        <div class="plant-info">
          <div class="plant-image" v-if="plant.image_url">
            <img :src="plant.image_url" :alt="plant.common_name || plant.scientific_name" />
          </div>
          <div class="plant-data">
            <p v-if="plant.scientific_name"><span>Bilimsel Adı:</span> {{ plant.scientific_name }}</p>
            <p v-if="plant.family_common_name"><span>Aile:</span> {{ plant.family_common_name }}</p>
            <p v-if="plant.family"><span>Bilimsel Aile:</span> 
              <span class="clickable" @click="browseByFamily(plant.family)">{{ plant.family }}</span>
            </p>
            <p v-if="plant.genus"><span>Cins:</span> 
              <span class="clickable" @click="browseByGenus(plant.genus)">{{ plant.genus }}</span>
            </p>
            <p v-if="plant.year"><span>Keşif Yılı:</span> {{ plant.year }}</p>
            <p v-if="plant.author"><span>Tanımlayan:</span> {{ plant.author }}</p>
            <p v-if="plant.bibliography"><span>Kaynakça:</span> {{ plant.bibliography }}</p>
            <p v-if="plant.observations"><span>Gözlemler:</span> {{ plant.observations }}</p>
            <p v-if="plant.vegetable"><span>Sebze mi?</span> {{ plant.vegetable ? 'Evet' : 'Hayır' }}</p>
            <p v-if="plant.edible"><span>Yenilebilir mi?</span> {{ plant.edible ? 'Evet' : 'Hayır' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #e0e0e0;
  background-color: #1a1a1a;
  border-radius: 8px;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
  height: 100%;
}

.search-container {
  width: 100%;
  max-width: 1000px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  margin-bottom: 1rem;
  background: none;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  color: #4CAF50;
  background: none;
  text-align: center;
}

.subtitle {
  color: #e0e0e0;
  text-align: center;
  margin-bottom: 2rem;
  background: none;
  font-size: 1.2rem;
}

input {
  padding: 0.8rem 1rem;
  width: 60%;
  border: none;
  border-radius: 4px 0 0 4px;
  font-size: 1rem;
  background-color: #333;
  color: #fff;
}

input::placeholder {
  color: #aaa;
}

.search-button {
  padding: 0.8rem 1.5rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.search-button:hover {
  background-color: #3e8e41;
}

.loading, .error {
  margin: 1rem 0;
  padding: 1rem;
  border-radius: 4px;
  text-align: center;
  color: #e0e0e0;
}

.loading {
  background-color: #333;
}

.error {
  background-color: rgba(255, 0, 0, 0.2);
  color: #ff6b6b;
}

.content-container {
  display: flex;
  gap: 2rem;
  width: 100%;
}

.search-results {
  flex: 0 0 30%;
  background-color: #252525;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: left;
  max-height: 600px;
  overflow-y: auto;
}

.search-results h3 {
  color: #4CAF50;
  margin-bottom: 1rem;
  font-size: 1.4rem;
}

.search-results ul {
  list-style: none;
  padding: 0;
}

.search-results li {
  padding: 0.8rem;
  border-bottom: 1px solid #444;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-results li:hover {
  background-color: #444;
}

.search-results li.active {
  background-color: #4CAF50;
  color: white;
}

.load-more {
  width: 100%;
  margin-top: 1rem;
  border-radius: 4px;
  padding: 0.8rem 1.5rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.plant-details {
  flex: 1;
  margin-top: 0;
  padding: 1.5rem;
  background-color: #252525;
  border-radius: 8px;
}

.plant-details h2 {
  color: #4CAF50;
  margin-bottom: 1.5rem;
  text-align: center;
}

.plant-info {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.plant-image {
  flex: 1;
  min-width: 300px;
}

.plant-image img {
  width: 100%;
  border-radius: 8px;
  object-fit: cover;
}

.plant-data {
  flex: 1;
  min-width: 300px;
}

.plant-data p {
  margin-bottom: 0.8rem;
  line-height: 1.6;
  color: #e0e0e0;
}

.plant-data span {
  color: #4CAF50;
  font-weight: bold;
}

.clickable {
  color: #4CAF50;
  cursor: pointer;
  text-decoration: underline;
}

.clickable:hover {
  color: #3e8e41;
}

@media (max-width: 768px) {
  .content-container {
    flex-direction: column;
  }
  
  .search-results {
    max-height: 300px;
  }
  
  .search-container {
    flex-direction: column;
    align-items: center;
  }

  input {
    width: 100%;
    border-radius: 4px;
    margin-bottom: 0.5rem;
  }

  .search-button {
    width: 100%;
    border-radius: 4px;
  }

  .plant-info {
    flex-direction: column;
  }
  
  .plant-image, .plant-data {
    min-width: 100%;
  }
}
</style>

<script>
import plantService from '../services/plantService.js';

export default {
  data() {
    return {
      searchQuery: '',
      plant: null,
      searchResults: [],
      loading: false,
      error: null,
      showResults: false,
      currentPage: 1,
      totalPages: 0
    }
  },
  methods: {
    async searchPlant() {
      if (!this.searchQuery.trim()) {
        this.error = 'Lütfen bir bitki adı girin';
        return;
      }

      this.loading = true;
      this.error = null;
      this.plant = null;
      this.searchResults = [];
      this.showResults = true;

      try {
        // Servis üzerinden API'ye istek yapılıyor
        const response = await plantService.searchPlants(this.searchQuery);
        
        if (response.data && response.data.length > 0) {
          this.searchResults = response.data;
          this.totalPages = Math.ceil(response.meta?.total / 20) || 1;
          
          // İlk sonucu otomatik olarak gösteriyoruz
          await this.showPlantDetails(response.data[0].id);
        } else {
          this.error = 'Aradığınız bitki bulunamadı.';
        }
        
        this.loading = false;
      } catch (err) {
        console.error('Arama hatası:', err);
        this.error = 'Bitki bilgisi alınamadı. Örnek veriler kullanılıyor.';
        this.loading = false;
        
        // Hata durumunda örnek verileri göster
        this.searchResults = [];
        this.plant = null;
        this.searchQuery = 'Ladin'; // Örnek bir arama yapalım
        this.searchPlant(); // Tekrar deneyelim
      }
    },
    
    async showPlantDetails(plantId) {
      this.loading = true;
      this.error = null;
      
      try {
        const detailResponse = await plantService.getPlantDetails(plantId);
        this.plant = detailResponse.data;
        this.loading = false;
      } catch (err) {
        this.error = 'Bitki detayları alınamadı. Lütfen tekrar deneyin.';
        this.loading = false;
      }
    },
    
    async loadMorePlants() {
      if (this.currentPage >= this.totalPages) return;
      
      this.loading = true;
      this.currentPage++;
      
      try {
        const response = await plantService.searchPlants(this.searchQuery, this.currentPage);
        
        if (response.data && response.data.length > 0) {
          this.searchResults = [...this.searchResults, ...response.data];
        }
        
        this.loading = false;
      } catch (err) {
        this.error = 'Daha fazla bitki yüklenirken hata oluştu.';
        this.loading = false;
      }
    },
    
    async browseByFamily(family) {
      this.loading = true;
      this.error = null;
      this.plant = null;
      this.searchResults = [];
      this.currentPage = 1;
      
      try {
        const response = await plantService.getPlantsByFamily(family);
        
        if (response.data && response.data.length > 0) {
          this.searchResults = response.data;
          this.totalPages = Math.ceil(response.meta?.total / 20) || 1;
          this.showResults = true;
          
          // İlk sonucu otomatik olarak gösteriyoruz
          await this.showPlantDetails(response.data[0].id);
        } else {
          this.error = 'Bu familyada bitki bulunamadı.';
        }
        
        this.loading = false;
      } catch (err) {
        this.error = 'Bitki bilgisi alınamadı. Lütfen tekrar deneyin.';
        this.loading = false;
      }
    },
    
    async browseByGenus(genus) {
      this.loading = true;
      this.error = null;
      this.plant = null;
      this.searchResults = [];
      this.currentPage = 1;
      
      try {
        const response = await plantService.getPlantsByGenus(genus);
        
        if (response.data && response.data.length > 0) {
          this.searchResults = response.data;
          this.totalPages = Math.ceil(response.meta?.total / 20) || 1;
          this.showResults = true;
          
          // İlk sonucu otomatik olarak gösteriyoruz
          await this.showPlantDetails(response.data[0].id);
        } else {
          this.error = 'Bu cinste bitki bulunamadı.';
        }
        
        this.loading = false;
      } catch (err) {
        this.error = 'Bitki bilgisi alınamadı. Lütfen tekrar deneyin.';
        this.loading = false;
      }
    }
  }
}
</script>