<template>
  <main>
    <h2>Les catégories de produits</h2>

    <select v-model="selectedCategoryId" @change="fetchProduitsParCategorie">
      <option disabled value="">-- Choisir une catégorie --</option>
      <option v-for="cat in categories" :key="cat.code" :value="cat.code">
        {{ cat.libelle }}
      </option>
    </select>

    <h3>Les produits</h3>
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
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { doAjaxRequest } from "@/api";

const categories = ref([]);
const selectedCategoryId = ref("");
const produits = ref([]);

// Charger toutes les catégories au démarrage
const fetchCategories = async () => {
  try {
    const json = await doAjaxRequest("/api/categories?sort=libelle,asc");
    categories.value = json._embedded.categories;
    if (categories.value.length > 0) {
      selectedCategoryId.value = categories.value[0].code;
      await fetchProduitsParCategorie();
    }
  } catch (err) {
    console.error("Erreur lors du chargement des catégories :", err);
  }
};

const fetchProduitsParCategorie = async () => {
  if (!selectedCategoryId.value) return;
  try {
    const json = await doAjaxRequest(`/api/categories/${selectedCategoryId.value}/produits`);
    produits.value = json._embedded.produits;
  } catch (err) {
    console.error("Erreur lors du chargement des produits :", err);
    produits.value = [];
  }
};

onMounted(fetchCategories);
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

select {
  margin: 1em 0;
  padding: 0.5em;
}
</style>
