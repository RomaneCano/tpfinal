import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CategorieView from '../views/CategorieView.vue'
import ProductList from '../views/ProductList.vue'
import CategorieProduits from '../views/CategorieProduits.vue'
import ClientsView from '../views/ClientsView.vue'
import CommandeView from '../views/CommandeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
    // Associe des chemins d'accès au composant vue à afficher
  routes: [
    {
      path: '/', // Chemin d'accès
      name: 'home', // Nom du chemin d'accès
      component: HomeView // Composant à afficher
    },
    {
      path: '/categories',
      name: 'categories',
      component: CategorieView
    },
    {
    path: '/categorieproduits',
    name: 'categorieproduits',
    component: CategorieProduits
},

    {
      path: '/products',
      name: 'products',
      component: ProductList
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },

    {
      path: '/commandes',
      name: 'commandes',
      component: CommandeView
    },

    {
      path: '/clients',
      name: 'clients',
      component: ClientsView
    }


  ]


})

export default router
