import { z } from "astro:schema";
import { ActionError, defineAction } from "astro:actions";
import { fetchClient } from "@/lib/client";

export const server = {
  logoutFunction: defineAction({
    accept: "form",
    handler: async (input, context) => {
      console.log("logout");
      context.cookies.delete("roletoken");
      return { success: true };
    },
  }),
  addConductor: defineAction({
    accept: "json",
    input: z.object({
      email: z.string().email(),
      password: z.string(),
    }),
    handler: async (input, context) => {
      console.log("input", input);

      if (!context.cookies.get("roletoken")) {
        throw new ActionError({
          code: "UNAUTHORIZED",
          message: "Not logged in",
        });
      }

      if (!context.cookies.get("roletoken")?.value) {
        throw new ActionError({
          code: "UNAUTHORIZED",
          message: "Not logged in",
        });
      }

      const token = context.cookies.get("roletoken")?.value;

      try {
        const { data } = await fetchClient.request({
          method: "POST",
          url: "/manager/addconductor",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: {
            email: input.email,
            password: input.password,
          },
        });

        console.log("data response", data);

        if (!data) {
          throw new ActionError({
            code: "BAD_REQUEST",
            message: "Failed to add conductor",
          });
        }

        return { success: true };
      } catch (error) {
        console.log(error);
        throw new ActionError({
          code: "BAD_REQUEST",
          message: "Failed to add conductor",
        });
      }
    },
  }),
  addLocation: defineAction({
    accept: "form",
    input: z.object({
      name: z.string(),
    }),
    handler: async (input, context) => {
      console.log("input", input);

      if (!context.cookies.get("roletoken")) {
        throw new ActionError({
          code: "UNAUTHORIZED",
          message: "Not logged in",
        });
      }

      const token = context.cookies.get("roletoken")?.value;

      try {
        const { data } = await fetchClient.request({
          method: "POST",
          url: "/manager/addlocation",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          data: {
            name: input.name,
          },
        });

        return { success: true };
      } catch (error) {
        console.log(error);
        throw new ActionError({
          code: "BAD_REQUEST",
          message: "Failed to add location",
        });
      }
    },
  }),
};
