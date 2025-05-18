import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/system/HomeView.vue'
import FareView from '@/views/system/FareView.vue'
import AboutView from '@/views/system/AboutView.vue'
import RoutesView from '@/views/system/RoutesView.vue'
import GuideView from '@/views/system/GuideView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/fare',
      name: 'fare',
      component: FareView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
    {
      path: '/routes',
      name: 'routes',
      component: RoutesView,
    },
    {
      path: '/guide',
      name: 'guide',
      component: GuideView,
    },
  ],
})

export default router
