<template>
  <div class="p-6">
    <input
      v-model="search"
      @input="fetchPlants"
      placeholder="Bitki ara..."
      class="border p-2"
    />
    <ul>
      <li v-for="plant in plants" :key="plant.id">
        {{ plant.common_name || plant.scientific_name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { getPlants } from "@/services/trefle";

const search = ref("");
const plants = ref([]);

const fetchPlants = async () => {
  if (search.value.length < 3) return;
  const data = await getPlants(search.value);
  plants.value = data?.data || [];
};
</script>
