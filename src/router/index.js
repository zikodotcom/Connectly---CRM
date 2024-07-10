import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import AdminLayouts from '@/layouts/AdminLayouts.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/',
      name: 'dashboard',
      component: AdminLayouts,
      children: [
        {
          path: '/dashboard',
          name: 'home',
          component: () => import('../views/Dashboard.vue'),
          meta: { layout: 'AdminLayouts' }
        }
      ]
    }
  ]
})

export default router
