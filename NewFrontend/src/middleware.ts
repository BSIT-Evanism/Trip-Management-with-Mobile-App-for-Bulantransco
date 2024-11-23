import { defineMiddleware } from "astro:middleware";

// `context` and `next` are automatically typed
export const onRequest = defineMiddleware(async (context, next) => {
  const token = context.cookies.get("roletoken");

  console.log("roletoken", token);

  if (!token) {
    console.log("no token");
    context.locals.valid = false;
    context.locals.role = null;
    return next();
  }

  try {
    const data = await fetch(
      `http://localhost:5001/auth/verify/${token.value}`
    );

    const json = await data.json();

    if (json.valid) {
      context.locals.valid = true;
      context.locals.role = json.role;
    } else {
      context.locals.valid = false;
      context.locals.role = null;
      context.cookies.delete("roletoken");
    }

    return next();
  } catch (error) {
    console.error(error);
    context.locals.valid = false;
    context.locals.role = null;
    return next();
  }
});
