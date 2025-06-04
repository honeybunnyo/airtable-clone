import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const baseRouter = createTRPCRouter({
  create: protectedProcedure
   .mutation(async ({ ctx }) => {
      const newBase = await ctx.db.base.create({
        data: {
          name: 'Untitled',
          user: { connect: { id: ctx.session.user.id } },
          tables: {
            create: {
              name: 'Table 1',
              columns: {
                create: [
                  { name: 'name', type: 'TEXT' },
                  { name: 'email', type: 'TEXT' },
                ],
              },
              rows: {
                create: [
                  {
                    data: {
                      name: 'Alice',
                      email: 'alice@example.com',
                    },
                  },
                  {
                    data: {
                      name: 'Bob',
                      email: 'bob@example.com',
                    },
                  },
                  {
                    data: {},
                  },
                ],
              },
            },
          },
        },
        include: {
          tables: {
            select: {
              id: true,
            },
          },
        },
      });
      return {
        baseId: newBase.id,
        tableId: newBase.tables[0]?.id ?? null,
      };
    }),

    // .mutation(async ({ ctx }) => {
    //   const newBase = await ctx.db.base.create({
    //     data: {
    //       name: 'Untitled Base',
    //       user: { connect: { id: ctx.session.user.id } },
    //       tables: {
    //         create: {
    //           name: 'Table 1',
    //           columns: {
    //             create: [
    //               {
    //                 name: 'name',
    //                 type: 'TEXT',
    //               },
    //               {
    //                 name: 'email',
    //                 type: 'TEXT',
    //               },
    //             ],
    //           },
    //         },
    //       },
    //     },
    //   });
    //   return newBase.id;
    // }),
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
  getAllTables: protectedProcedure
    .input(z.object({ baseId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.table.findMany({
        where: { id: input.baseId },
        select: { id: true, name: true },
      });
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
              rows: true,
            },
          },
        },
      });

      if (!base || base.userId !== ctx.session.user.id) {
        throw new Error("Unauthorized or base not found");
      }

      for (const table of base.tables) {
        await ctx.db.column.deleteMany({ where: { tableId: table.id } });
        await ctx.db.row.deleteMany({ where: { tableId: table.id } });
      }

      await ctx.db.table.deleteMany({ where: { baseId: base.id } });
      await ctx.db.base.delete({ where: { id: base.id } });
      return { success: true };
    }),
});
