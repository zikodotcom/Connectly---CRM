import { createRouter, createWebHistory } from 'vue-router'
import AdminLayouts from '@/layouts/AdminLayouts.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Login.vue')
    },
    {
      path: '/',
      component: AdminLayouts,
      children: [
        {
          path: '/',
          name: 'home',
          component: () => import('../views/Dashboard.vue'),
          meta: { layout: 'AdminLayouts' }
        },
        {
          path: '/projects',
          name: 'projects',
          component: () => import('../views/Projects.vue'),
          meta: { layout: 'AdminLayouts' }
        },
        {
          path: '/employee',
          name: 'employee',
          component: () => import('../views/Employee.vue'),
          meta: { layout: 'AdminLayouts' }
        },
        {
          path: '/client',
          name: 'client',
          component: () => import('../views/Client.vue'),
          meta: { layout: 'AdminLayouts' }
        }
      ]
    }
  ]
})

export default router
