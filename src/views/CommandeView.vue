<template>
  <main>
    <h4>Choisir un client :</h4>
    <select v-model="selectedClient" @change="loadCommandes">
      <option v-for="client in clients" :key="client.code" :value="client">
        {{ client.code }} - {{ client.societe }}
      </option>
    </select>

    <button @click="creerCommande" :disabled="!selectedClient">Nouvelle commande pour ce client</button>

    <h4>Commandes en cours :</h4>
    <select v-model="selectedCommande">
      <option v-for="commande in commandes" :key="commande.id" :value="commande">
        {{ commande.id }}
      </option>
    </select>

    <button @click="expedierCommande" :disabled="!selectedCommande">Expédier cette commande</button>

    <h4>Produits disponibles</h4>
    <select v-model="selectedProduit">
      <option v-for="produit in produits" :key="produit.reference" :value="produit">
        {{ produit.nom }} - {{ produit.unitesEnStock }} disponibles
      </option>
    </select>

    <div>
      <h4>Quantité à commander : {{ quantite }}</h4>
      <input type="range" v-model="quantite" min="1" :max="selectedProduit?.unitesEnStock || 1">
    </div>

    <button @click="ajouterProduit" :disabled="!selectedProduit || !selectedCommande">Ajouter ce produit à la commande</button>

    <h4>Lignes de commande</h4>
    <table>
      <thead>
      <tr>
        <th>Référence</th>
        <th>Nom</th>
        <th>Prix Unitaire</th>
        <th>Quantité</th>
        <th>Action</th>
      </tr>
      </thead>
      <tbody>
      <tr v-if="lignes.length === 0">
        <td colspan="5">Commande vide</td>
      </tr>
      <tr v-for="ligne in lignes" :key="ligne.id">
        <td>{{ ligne.produit.reference }}</td>
        <td>{{ ligne.produit.nom }}</td>
        <td>{{ ligne.produit.prixUnitaire }}</td>
        <td>{{ ligne.quantite }}</td>
        <td><button @click="supprimerLigne(ligne.id)">Supprimer</button></td>
      </tr>
      </tbody>
    </table>
  </main>
</template>
<script setup>
import { ref, onMounted, watch } from "vue";
import { doAjaxRequest, doAjaxPost, doAjaxDelete } from "@/api";

const clients = ref([]);
const produits = ref([]);
const commandes = ref([]);
const lignes = ref([]);
const selectedClient = ref(null);
const selectedProduit = ref(null);
const selectedCommande = ref(null);
const quantite = ref(1);

const loadClients = async () => {
  const json = await doAjaxRequest("/api/clients?sort=societe,asc");
  clients.value = json._embedded.clients;
};

const loadProduits = async () => {
  const json = await doAjaxRequest("/api/produits");
  produits.value = json._embedded.produits;
};

const loadCommandes = async () => {
  if (!selectedClient.value) return;

  const href = `/api/clients/${selectedClient.value.code}/commandes`;
  const json = await doAjaxRequest(href, {
    headers: { Accept: "application/hal+json" }
  });

  commandes.value = json._embedded?.commandes || [];
};

const loadLignes = async () => {
  if (!selectedCommande.value) return;
  const json = await doAjaxRequest(`/api/commandes/${selectedCommande.value.id}/lignes`);
  lignes.value = json._embedded?.lignes || [];
};

const creerCommande = async () => {
  const res = await doAjaxPost("/api/commandes", {
    client: `/api/clients/${selectedClient.value.code}`,
    envoyee: false
  });

  await loadCommandes();

  const selfUrl = res._links.self.href;
  const id = selfUrl.split("/").pop();
  selectedCommande.value = { id };

  await loadLignes();
};

const ajouterProduit = async () => {
  if (!selectedProduit.value || !selectedCommande.value) return;

  const produitRef = selectedProduit.value.reference;
  const commandeId = selectedCommande.value.id;

  const body = {
    quantite: quantite.value,
    commande: `/api/commandes/${commandeId}`,
    produit: `/api/produits/${produitRef}`
  };

  await doAjaxPost("/api/lignes", body);
  await loadLignes();
};

const expedierCommande = async () => {
  await doAjaxPost(`/api/commandes/${selectedCommande.value.id}/expedier`, {});
  commandes.value = commandes.value.filter(c => c.id !== selectedCommande.value.id);
  lignes.value = [];
  selectedCommande.value = null;
};

const supprimerLigne = async (id) => {
  await doAjaxDelete(`/api/lignes/${id}`);
  await loadLignes();
};

onMounted(() => {
  loadClients();
  loadProduits();
});

watch(selectedCommande, loadLignes);
</script>



<style scoped>
select, button, input[type="range"] {
  margin: 0.5em 0;
  display: block;
}

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
</style>
