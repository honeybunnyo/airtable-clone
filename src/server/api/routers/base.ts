import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const baseRouter = createTRPCRouter({
  create: protectedProcedure
   .mutation(async ({ ctx }) => {
    const base = await ctx.db.base.create({
      data: {
        name: 'Untitled',
        user: { connect: { id: ctx.session.user.id } },
      },
      select: { id: true },
    });

    return {
      baseId: base.id,
    };
  }),
  getBaseById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return ctx.db.base.findUnique({
        where: { id: input.id },
        include: { user: true, tables: true },
      })
    }),
  getAllBases: protectedProcedure
    .query(async({ ctx }) => {
      return ctx.db.base.findMany({
        where: {
          userId: ctx.session.user.id,
          deleted: false,
        },
        include: {
          tables: { select: { id: true } },
        },
      })
    }),
  updateBaseName: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.base.update({
        where: { id: input.id },
        data: { name: input.name },
      });
    }),
  delete: protectedProcedure
  .input(z.object({ id: z.string() }))
  .mutation(async ({ input, ctx }) => {
    const base = await ctx.db.base.findUnique({
      where: { id: input.id },
    });

    if (!base || base.userId !== ctx.session.user.id) {
      throw new Error("Base not found");
    }

    await ctx.db.base.update({
      where: { id: input.id },
      data: { deleted: true },
    });

    return { success: true };
  }),
});
