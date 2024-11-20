import { verifyToken } from "~/utils/jwt";
import { compareSync } from "bcrypt"; // for backend

// @ts-expect-error
export const doPreChecks = async (event, api: String) => {
  appendCorsHeaders(event, {
    origin: "*",
    preflight: {
      statusCode: 204,
    },
    methods: "*",
  });
  const config = useRuntimeConfig();
  // cricumvent auth system if set
  if (!compareSync("useNoAuthSystem", config.public.DO_NOT_USE_AUTH)) {
    console.log(
      `in api ${api}, unas:`,
      compareSync("useNoAuthSystem", config.public.DO_NOT_USE_AUTH)
    );

    const token = getCookie(event, "user_auth_token");
    if (!token) {
      throw createError({ statusCode: 401, message: "Unauthorized" });
    }

    const JWT_SECRET = new TextEncoder().encode(config.public.JWT_SECRET);

    const payload = await verifyToken(token, JWT_SECRET);
    if (!payload) {
      throw createError({ statusCode: 401, message: "Invalid token" });
    }
  } else {
    console.log(
      `in api ${api}, unas:`,
      compareSync("useNoAuthSystem", config.public.DO_NOT_USE_AUTH)
    );
  }
};
