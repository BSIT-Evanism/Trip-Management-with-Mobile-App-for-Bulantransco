import { defineAction } from "astro:actions";

export const server = {
  logoutFunction: defineAction({
    accept: "form",
    handler: async (input, context) => {
      console.log("logout");
      context.cookies.delete("roletoken");
      return { success: true };
    },
  }),
};
