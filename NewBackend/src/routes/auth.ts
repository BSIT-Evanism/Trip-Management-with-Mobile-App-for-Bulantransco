import { Hono, type HonoRequest } from "hono";
import { decode, sign, verify } from "hono/jwt";
import { HTTPException } from "hono/http-exception";
import { env } from "hono/adapter";
import dotenv from "dotenv";

dotenv.config();

const verifyToken = async (req: HonoRequest) => {
  const token = req.query("token");
  if (!token) {
    return null;
  }
  try {
    return await verify(token, process.env.SECRET_KEY!);
  } catch (error) {
    return null;
  }
};

const auth = new Hono();

auth.get("/", (c) => {
  return c.json({ message: "Hello World" });
});

auth.post("/login", async (c) => {
  const body = await c.req.json();
  const {
    CONDUCTOR_USER_NAME,
    CONDUCTOR_USER_PASSWORD,
    ADMIN_USER_NAME,
    ADMIN_USER_PASSWORD,
  } = env<{
    CONDUCTOR_USER_NAME: string;
    CONDUCTOR_USER_PASSWORD: string;
    ADMIN_USER_NAME: string;
    ADMIN_USER_PASSWORD: string;
  }>(c);

  console.log(
    CONDUCTOR_USER_NAME,
    CONDUCTOR_USER_PASSWORD,
    ADMIN_USER_NAME,
    ADMIN_USER_PASSWORD
  );

  if (body.username === "" && body.password === "") {
    throw new HTTPException(401, {
      res: c.json({ error: "Invalid credentials" }, 401),
    });
  }

  console.log(process.env.CONDUCTOR_USER_NAME!);

  if (
    body.username === CONDUCTOR_USER_NAME &&
    body.password === CONDUCTOR_USER_PASSWORD
  ) {
    const token = await sign({ role: "conductor" }, process.env.SECRET_KEY!);
    return c.json({ token });
  } else if (
    body.username === ADMIN_USER_NAME &&
    body.password === ADMIN_USER_PASSWORD
  ) {
    const token = await sign({ role: "admin" }, process.env.SECRET_KEY!);
    return c.json({ token });
  }
  throw new HTTPException(401, {
    res: c.json({ error: "Invalid credentials" }, 401),
  });
});

auth.get("/verify", async (c) => {
  const token = await verifyToken(c.req);
  if (token) {
    return c.json({ valid: true, role: token.role });
  } else {
    throw new HTTPException(401, {
      res: c.json({ valid: false, role: null }, 401),
    });
  }
});

export default auth;
