<template>
  <main>
    <h2>Les clients - page {{ page }} / {{ totalPages }}</h2>
    <table>
      <thead>
      <tr>
        <th>Code</th>
        <th>Société</th>
        <th>Contact</th>
        <th>Ville</th>
      </tr>
      </thead>
      <tbody>
      <tr v-if="clients.length === 0">
        <td colspan="4">Chargement des clients...</td>
      </tr>
      <tr v-for="client in clients" :key="client.code">
        <td>{{ client.code }}</td>
        <td>{{ client.societe }}</td>
        <td>{{ client.contact }}</td>
        <td>{{ client.adresse.ville }}</td>
      </tr>
      </tbody>
    </table>

    <div class="pagination">
      <button @click="setPage(1)" :disabled="page === 1">⏮</button>
      <button @click="setPage(page - 1)" :disabled="page === 1">⬅</button>
      <button @click="setPage(page + 1)" :disabled="page === totalPages">➡</button>
      <button @click="setPage(totalPages)" :disabled="page === totalPages">⏭</button>
    </div>
  </main>
</template>

<script setup>
import {ref, onMounted, watch} from "vue";
import {doAjaxRequest} from "@/api";

const clients = ref([]);
const page = ref(1);
const pageSize = 5;
const totalPages = ref(1);

const fetchClients = async () => {
  try {
    const json = await doAjaxRequest(`/api/clients?page=${page.value - 1}&size=${pageSize}&sort=societe,asc`);
    clients.value = json._embedded.clients;
    totalPages.value = json.page.totalPages;
  } catch (error) {
    console.log("Erreur lors du chargement des clients :", error);
    clients.value = [];
  }
};

const setPage = (val) => {
  if (val >= 1 && val <= totalPages.value) {
    page.value = val;
  }
};

onMounted(fetchClients);
watch(page, fetchClients);
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
