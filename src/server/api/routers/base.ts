import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const baseRouter = createTRPCRouter({
  createBase: protectedProcedure
    .mutation(async ({ ctx }) => {
      const newBase = await ctx.db.base.create({
        data: {
          name: 'Untitled Base',
          user: { connect: { id: ctx.session.user.id } },
        }
      });
      return newBase.id;
    }),
  getBaseById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return ctx.db.base.findUnique({
        where: { id: input.id },
        include: { user: true },
      })
    }),
  getAllBases: protectedProcedure
    .query(async({ ctx }) => {
      return ctx.db.base.findMany({
        where: { userId: ctx.session.user.id },
      })
    })
});
