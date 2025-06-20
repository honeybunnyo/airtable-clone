import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const viewRouter = createTRPCRouter({
  getViewsByTable: protectedProcedure
    .input(z.object({ tableId: z.string() }))
    .query(async ({ input, ctx }) => {
      const views = await ctx.db.table.findUnique({
        where: { id: input.tableId },
        select: {
          views: true,
        },
      });
      if (!views) throw new Error("views not found")

      return views;
    }),
  create: protectedProcedure
    .input(z.object({ tableId: z.string(), name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const view = await ctx.db.view.create({
        data: {
          name: input.name,
          tableId: input.tableId,
        },
        select: {
          id: true
        }
      })
      return view;
    }),
  delete: protectedProcedure
    .input(z.object({ viewId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.view.delete({ where: { id: input.viewId } });
    }),
});
