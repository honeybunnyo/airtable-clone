import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const columnRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({
      tableId: z.string(),
      name: z.string(),
      type: z.enum(["TEXT", "NUMBER"]),
    }))
    .mutation(async ({ input, ctx }) => {
      const columnCount = await ctx.db.column.count({
        where: { tableId: input.tableId },
      })

      const newColumn = await ctx.db.column.create({
        data: {
          tableId: input.tableId,
          name: input.name,
          type: input.type,
          order: columnCount,
        },
      });

      const rows = await ctx.db.row.findMany({
        where: { tableId: input.tableId },
        select: { id: true },
      });

      const BATCH_SIZE = 5000;
      for (let i = 0; i < rows.length; i += BATCH_SIZE) {
        const batch = rows.slice(i, i + BATCH_SIZE).map(row => ({
          rowId: row.id,
          columnId: newColumn.id,
          value: "",
        }));

        await ctx.db.cell.createMany({ data: batch });
      }
      return {id: newColumn.id};
    }),
  delete: protectedProcedure
    .input(z.object({ columnId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const column = await ctx.db.column.findUnique({
        where: { id: input.columnId },
      });
      
      if (!column) throw new Error('Column not found');

      await ctx.db.column.delete({
        where: { id: input.columnId },
      });

      return {success: true};
    }),
});
