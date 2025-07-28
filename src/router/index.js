import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '@/views/public/LandingView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingView,
      meta: {
        auth: false
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/public/AboutView.vue'),
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/protected/auth/LoginView.vue"),
      beforeEnter: () => {
        const user = JSON?.parse(localStorage.getItem("sb-kuimahrftawdqfjskrcx-auth-token"))
        if (user) {
          return `/${user?.user.user_metadata.user_name}`
        }
      }
    },
    {
      path: "/signup",
      name: "signup",
      component: () => import("@/views/protected/auth/SignUpView.vue"),
      beforeEnter: () => {
        const user = JSON?.parse(localStorage.getItem("sb-kuimahrftawdqfjskrcx-auth-token"))
        if (user) {
          return `/${user?.user.user_metadata.user_name}`
        }
      }
    },
    {
      path: "/:user",
      name: "admin_dashboard",
      component: () => import("@/views/protected/DashboardView.vue"),
      meta: {
        auth: true
      }
    },

    // Stores an d Tickets
    {
      path: "/:user/store/:id",
      name: "admin_store",
      component: () => import("@/views/protected/StoreView.vue"),
      meta: {
        auth: true
      }
    },
    {
      path: "/:user/store/tickets/:id",
      name: "admin_store_tickets",
      component: () => import("@/views/protected/StoreTicketsView.vue"),
      meta: {
        auth: true
      }
    },
    {
      path: "/:user/store/create",
      name: "admin_storecreate",
      component: () => import("@/views/protected/CreateStoreView.vue"),
      meta: {
        auth: true
      }
    },
    {
      path: "/shared/store/:name_store/by/:user",
      name: "share_store",
      component: () => import("@/views/protected/StoreSharedView.vue"),
      meta: {
        auth: true
      }
    },

    // Usuarios
    {
      path: "/users",
      name: "admin_users",
      component: () => import("@/views/protected/users/UsersView.vue"),
      meta: {
        auth: true
      }
    }
  ],
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.auth && !auth.user) {
    next({ name: "login" })
  } else {
    next()
  }
})

export default router
