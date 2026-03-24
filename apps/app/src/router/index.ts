import { useAuthStore } from "@/stores/auth";
import { ROUTE } from "@/utils/constants/route.constant";
import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

const AuthView = () => import("@/views/AuthView.vue");
const ChatView = () => import("@/views/ChatView.vue");
const NotFoundView = () => import("@/views/NotFoundView.vue");

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: ROUTE.AUTH,
    component: AuthView,
    alias: "/auth",
  },
  {
    path: "/chat",
    name: ROUTE.CHAT,
    component: ChatView,
    meta: { requiresAuth: true },
  },
  {
    path: "/:pathMatch(.*)*",
    component: NotFoundView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach(async (to) => {
  const store = useAuthStore();

  if (!store.isSessionChecked) {
    await store.getCurrentUser();
  }
  if (to.meta.requiresAuth && !store.isAuthenticated) {
    return { name: ROUTE.AUTH };
  }
  if (to.name === ROUTE.AUTH && store.isAuthenticated) {
    return { name: ROUTE.CHAT };
  }
});

export default router;
