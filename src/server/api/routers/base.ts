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
        where: { userId: ctx.session.user.id },
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
        include: {
          tables: {
            include: {
              columns: true,
              rows: {
                include: {
                  cells: true,
                },
              },
            },
          },
        },
      });

      if (!base || base.userId !== ctx.session.user.id) {
        throw new Error("Unauthorized or base not found");
      }

      for (const table of base.tables) {
        const rowIds = table.rows.map(r => r.id);
        await ctx.db.cell.deleteMany({ where: { rowId: { in: rowIds }, } });
        await ctx.db.column.deleteMany({ where: { tableId: table.id } });
        await ctx.db.row.deleteMany({ where: { tableId: table.id } });
      }

      await ctx.db.table.deleteMany({ where: { baseId: base.id } });
      await ctx.db.base.delete({ where: { id: base.id } });
      return { success: true };
    }),
});
