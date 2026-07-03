import { onRequestPost as __api_auth_login_ts_onRequestPost } from "/Users/andriipap/Andersseen/Web/Projects/angular-lab/functions/api/auth/login.ts"
import { onRequestPost as __api_auth_logout_ts_onRequestPost } from "/Users/andriipap/Andersseen/Web/Projects/angular-lab/functions/api/auth/logout.ts"
import { onRequestGet as __api_auth_me_ts_onRequestGet } from "/Users/andriipap/Andersseen/Web/Projects/angular-lab/functions/api/auth/me.ts"
import { onRequestPost as __api_auth_signup_ts_onRequestPost } from "/Users/andriipap/Andersseen/Web/Projects/angular-lab/functions/api/auth/signup.ts"

export const routes = [
    {
      routePath: "/api/auth/login",
      mountPath: "/api/auth",
      method: "POST",
      middlewares: [],
      modules: [__api_auth_login_ts_onRequestPost],
    },
  {
      routePath: "/api/auth/logout",
      mountPath: "/api/auth",
      method: "POST",
      middlewares: [],
      modules: [__api_auth_logout_ts_onRequestPost],
    },
  {
      routePath: "/api/auth/me",
      mountPath: "/api/auth",
      method: "GET",
      middlewares: [],
      modules: [__api_auth_me_ts_onRequestGet],
    },
  {
      routePath: "/api/auth/signup",
      mountPath: "/api/auth",
      method: "POST",
      middlewares: [],
      modules: [__api_auth_signup_ts_onRequestPost],
    },
  ]