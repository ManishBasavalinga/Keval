import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/core/Home";
import { fb } from "@/firebase/init";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    meta: {
      alreadyAuth: true,
    },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/auth/Login"),
    meta: {
      alreadyAuth: true,
    },
  },
  {
    path: "/signup",
    name: "signup",
    component: () => import("@/views/auth/Signup"),
    meta: {
      alreadyAuth: true,
    },
  },
  {
    path: "/not-verified",
    name: "notVerified",
    component: () => import("@/views/auth/NotVerified"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("@/views/dashboard/Dashboard"),
    meta: {
      requiresAuth: true,
      requiresVerification: true,
    },
  },
  {
    path: "/settings",
    name: "settings",
    component: () => import("@/views/settings/Settings"),
    meta: {
      requiresAuth: true,
      requiresVerification: true,
    },
  },
  {
    path: "*",
    name: "PageNotFound",
    component: () => import("@/views/core/PageNotFound"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  let isAuth = fb.auth().currentUser;
  let isVerified = isAuth ? fb.auth().currentUser.emailVerified : null;

  if (to.matched.some((rec) => rec.meta.requiresAuth)) {
    if (to.matched.some((rec) => rec.meta.requiresVerification)) {
      if (isVerified) {
        next();
      } else {
        next({
          name: "notVerified",
        });
      }
    } else {
      if (isAuth) {
        next();
      } else {
        next({
          name: "login",
        });
      }
    }
  } else if (to.matched.some((rec) => rec.meta.alreadyAuth)) {
    if (isAuth) {
      next({
        name: "dashboard",
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
