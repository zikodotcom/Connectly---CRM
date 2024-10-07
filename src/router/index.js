import { createRouter, createWebHistory } from 'vue-router'
import AdminLayouts from '@/layouts/AdminLayouts.vue'
import { store } from '@/store/store'
import { getCookie } from '@/functions/getCookie'
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
          path: '/project',
          name: 'project',
          component: () => import('../views/Project.vue'),
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
        },
        {
          path: '/task',
          name: 'task',
          component: () => import('../views/Task.vue'),
          meta: { layout: 'AdminLayouts' }
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.path == '/login' && getCookie('XSRF-TOKEN') !== null) {
    next({ path: '/' })
  }
  if (getCookie('XSRF-TOKEN') == null && to.path !== '/login') {
    next({ path: '/login' })
  } else {
    next() // Redirect to login page
  }
})

export default router
