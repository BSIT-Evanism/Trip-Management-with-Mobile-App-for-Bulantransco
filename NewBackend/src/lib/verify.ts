import { verify } from "hono/jwt";

export const verifyToken = async (token: string) => {
  if (!token) {
    return null;
  }
  try {
    return await verify(token, process.env.SECRET_KEY!);
  } catch (error) {
    return null;
  }
};
