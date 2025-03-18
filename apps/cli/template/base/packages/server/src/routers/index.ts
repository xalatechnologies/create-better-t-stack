import { router, publicProcedure } from "../lib/trpc";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),
});

export type AppRouter = typeof appRouter;
