import { Prisma } from "@prisma/client";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const columnRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({
      tableId: z.string(),
      name: z.string(),
      type: z.enum(["TEXT", "NUMBER"]),
    }))
    .mutation(async ({ input, ctx }) => {
      const newColumn = await ctx.db.column.create({
        data: {
          tableId: input.tableId,
          name: input.name,
          type: input.type,
        },
      });

      const rows = await ctx.db.row.findMany({
        where: { tableId: input.tableId },
        select: { id: true },
      });

      if (rows.length > 0) {
        await ctx.db.cell.createMany({
          data: rows.map(row => ({
            rowId: row.id,
            columnId: newColumn.id,
            value: ""
          })),
        });
      }
      return newColumn;
    }),
  delete: protectedProcedure
    .input(z.object({ columnId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const column = await ctx.db.column.findUnique({
        where: { id: input.columnId },
      });
      
      if (!column) throw new Error('Column not found');

      await ctx.db.cell.deleteMany({
        where: { columnId: input.columnId },
      });

      return ctx.db.column.delete({
        where: { id: input.columnId },
      });
    }),
});
