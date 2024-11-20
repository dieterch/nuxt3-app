import { useNuxtApp } from "#app";
import { useAuthToken } from "~/composables/useAuthToken";
import { compareSync } from "bcryptjs"; // for frontend

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (import.meta.server) {
    console.log("auth.ts running on backend, skipping");
    return;
  }

  const config = useRuntimeConfig();
  // cricumvent auth system if set
  if (!compareSync("useNoAuthSystem", config.public.DO_NOT_USE_AUTH)) {
    // console.log(
    //   "in auth middleware, unas:",
    //   compareSync("useNoAuthSystem", config.public.DO_NOT_USE_AUTH)
    // );

    const { getToken } = useAuthToken();
    const token = getToken();

    if (!token) {
      console.log("in auth.ts, no token => redirect to login");
      return navigateTo("/login");
    }

    try {
      const { $jwtHelper } = useNuxtApp();
      const payload = await $jwtHelper.verifyToken(token);
      // console.log('payload from verifyToken', payload)
      // You could store `payload` in a global state if needed
    } catch (err) {
      console.log("auth.ts jwtVerify Error:", err);
      return navigateTo("/login");
    }
  } else {
    console.log(
      "in auth middleware, unas:",
      compareSync("useNoAuthSystem", config.public.DO_NOT_USE_AUTH)
    );
  }
});
