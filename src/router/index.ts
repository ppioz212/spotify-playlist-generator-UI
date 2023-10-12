import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../components/LoginPage.vue'
import PlaylistUI from '../components/PlaylistUI.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    },
    {
        path: '/playlist',
        name: 'playlist',
        component: PlaylistUI
    }
  ]
})

export default router
