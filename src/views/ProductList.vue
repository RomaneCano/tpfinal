<template>
  <main>
    <h2>Les produits - page {{ page }} / {{ totalPages }}</h2>
    <table>
      <thead>
      <tr>
        <th>Nom</th>
        <th>Prix</th>
        <th>Stock</th>
        <th>Commandés</th>
      </tr>
      </thead>
      <tbody>
      <tr v-if="produits.length === 0">
        <td colspan="4">Chargement des produits...</td>
      </tr>
      <tr v-for="produit in produits" :key="produit.reference">
        <td>{{ produit.nom }}</td>
        <td>{{ produit.prixUnitaire }}</td>
        <td>{{ produit.unitesEnStock }}</td>
        <td>{{ produit.unitesCommandees }}</td>
      </tr>
      </tbody>
    </table>

    <div class="pagination">
      <button @click="setPage(1)" :disabled="page === 1">⏮-</button>
      <button @click="setPage(page - 1)" :disabled="page === 1">⬅</button>
      <button @click="setPage(page + 1)" :disabled="page === totalPages">➡</button>
      <button @click="setPage(totalPages)" :disabled="page === totalPages">⏭</button>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { doAjaxRequest } from "@/api";

const produits = ref([]);
const page = ref(1);
const pageSize = 5;
const totalPages = ref(1);

const fetchProduits = async () => {
  try {
    const json = await doAjaxRequest(`/api/produits?page=${page.value - 1}&size=${pageSize}&sort=nom,asc`);
    produits.value = json._embedded.produits;
    totalPages.value = json.page.totalPages;
  } catch (error) {
    console.log("Erreur lors du chargement des produits :", error);
    produits.value = [];
  }
};

const setPage = (val) => {
  if (val >= 1 && val <= totalPages.value) {
    page.value = val;
  }
};

onMounted(fetchProduits);
watch(page, fetchProduits);
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  background: #222;
  color: white;
  margin-top: 1em;
}

th, td {
  border: 1px solid white;
  padding: 0.5em;
  text-align: center;
}

.pagination {
  margin-top: 1em;
  display: flex;
  justify-content: center;
  gap: 1em;
}
</style>
