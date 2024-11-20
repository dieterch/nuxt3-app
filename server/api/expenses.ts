// server/api/expenses.ts
import { verifyToken } from "~/utils/jwt";
import { compareSync } from "bcrypt"; // for backend
import prisma from "~/prisma/client.js";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  // cricumvent auth system if set
  if (!compareSync("useNoAuthSystem", config.public.DO_NOT_USE_AUTH)) {
    console.log(
      "in api expenses.ts, unas:",
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
      "in api expenses.ts, unas:",
      compareSync("useNoAuthSystem", config.public.DO_NOT_USE_AUTH)
    );
  }
  try {
    if (event.node.req.method === "GET") {
      return await prisma.expense.findMany({
        include: {
          trip: true,
          user: true,
          category: true,
        },
      });
    }

    const body = await readBody(event); // Verwende readBody statt useBody
    console.log("expenses body:\n", body);

    if (event.node.req.method === "POST") {
      return await prisma.expense.create({
        data: body,
      });
    }

    if (event.node.req.method === "PUT") {
      return await prisma.expense.update({
        where: {
          id: body.id,
        },
        data: body,
      });
    }

    if (event.node.req.method === "DELETE") {
      const expense = await prisma.expense.delete({
        where: {
          id: body.id,
        },
      });
    }
  } catch (error) {
    console.error("Database operation error:", error);
    return { error: "An error occurred during the request." };
  }
});
