import Cookies from 'js-cookie'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // dashboard (protected)
  { path: '/', name: 'Home', component: HomeView, meta: { requiresAuth: true } },

  // auth (guest only) layout
  {
    path: '/',
    component: () => import('@/layouts/AuthPage.vue'),
    children: [
      { path: '/login', name: 'Login', component: LoginView },
      { path: '/register', name: 'Register', component: RegisterView },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// route guard
// Home = authenticated only
// authenticated can't access either login or register
router.beforeEach((to, _from, next) => {
  const isAuthenticated = !!Cookies.get('access_token')

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login' })
  } else if (isAuthenticated && (to.name === 'Login' || to.name === 'Register')) {
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router
