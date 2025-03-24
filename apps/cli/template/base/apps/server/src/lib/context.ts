import type { Context as HonoContext } from "hono";

export type CreateContextOptions = {
  hono: HonoContext;
};

export async function createContext({ hono }: CreateContextOptions) {
  return {
    session: null,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
