// server/api/trips.ts
// import { verifyToken } from "~/utils/jwt";
// import { compareSync } from "bcrypt"; // for backend
import { doPreChecks } from "~/utils/precheck";
import prisma from "~/prisma/client.js";

export default defineEventHandler(async (event) => {
  await doPreChecks(event, "trips.ts");
  // const config = useRuntimeConfig();
  // // cricumvent auth system if set
  // if (!compareSync("useNoAuthSystem", config.public.DO_NOT_USE_AUTH)) {
  //   console.log(
  //     "in api trips.ts, unas:",
  //     compareSync("useNoAuthSystem", config.public.DO_NOT_USE_AUTH)
  //   );

  //   const token = getCookie(event, "user_auth_token");
  //   if (!token) {
  //     throw createError({ statusCode: 401, message: "Unauthorized" });
  //   }

  //   const JWT_SECRET = new TextEncoder().encode(config.public.JWT_SECRET);

  //   const payload = await verifyToken(token, JWT_SECRET);
  //   if (!payload) {
  //     throw createError({ statusCode: 401, message: "Invalid token" });
  //   }
  // } else {
  //   console.log(
  //     "in api trips.ts, unas:",
  //     compareSync("useNoAuthSystem", config.public.DO_NOT_USE_AUTH)
  //   );
  // }

  try {
    if (event.node.req.method === "GET") {
      return await prisma.trip.findMany({
        select: {
          id: true,
          startDate: true,
          name: true,
          users: {
            select: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          expenses: true,
        },
      });
    }

    const body = await readBody(event); // Verwende readBody statt useBody
    console.log("trips body:\n", body);

    if (event.node.req.method === "POST") {
      return await prisma.trip.create({
        data: body,
      });
    }

    interface UserInput {
      userId: string;
      tripId: string;
    }

    // interface TripUpdateBody {
    //   id: string,
    //   name: string,
    //   startDate: string,
    //   users: UserInput[]
    // }

    // Update Trip - logic to prevent invalid operation in
    // the frontend code.
    if (event.node.req.method === "PUT") {
      const updatedTrip = await prisma.trip.update({
        where: { id: body.id },
        data: {
          name: body.name,
          startDate: body.startDate,
        },
      });

      // lösche alle tripUser des Trips
      await prisma.tripUser.deleteMany({
        where: {
          tripId: body.id,
        },
      });

      // und füge die selektierten user wieder ein.
      await Promise.all(
        body.users.map(async (user: UserInput) => {
          await prisma.tripUser.upsert({
            where: {
              userId_tripId: {
                userId: user.userId,
                tripId: body.id,
              },
            },
            update: {},
            create: {
              userId: user.userId,
              tripId: body.id,
            },
          });
        })
      );

      return updatedTrip;
    }

    if (event.node.req.method === "DELETE") {
      const trip = await prisma.trip.delete({
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
