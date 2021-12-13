import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import SingleChip from '@/views/SingleChip.vue'
import DoubleChip from '@/views/DoubleChip.vue'
import MultiChip from '@/views/MultiChip.vue'
import Login from '@/views/Login.vue'
import Settings from "@/views/Settings.vue"
import store from '@/store'

const authGuard = (to: any, from: any, next: any) => {
  if (store.getters['user/isAuthenticated']) {
      next()
  } else {
    next("/login")
  }
};

const loginGuard = (to: any, from: any, next: any) => {
  if (!store.getters['user/isAuthenticated']) {
      next()
  } else {
    next("/")
  }
};

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/singlechip'
  },
  {
    path: '/singlechip',
    name: 'SingleChip',
    component: SingleChip,
    beforeEnter: authGuard
  },
  {
    path: '/doublechip',
    name: 'DoubleChip',
    component: DoubleChip,
    beforeEnter: authGuard
  },
  {
    path: '/multichip',
    name: 'MultiChip',
    component: MultiChip,
    beforeEnter: authGuard
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    beforeEnter: loginGuard
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
    beforeEnter: authGuard
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router