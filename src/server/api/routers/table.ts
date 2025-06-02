import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const tableRouter = createTRPCRouter({
  getTableById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return ctx.db.table.findUnique({
        where: { id: input.id },
        include: {
          columns: true,
          rows: true
        },
      });
    }),
  addColumn: protectedProcedure
    .input(z.object({
      tableId: z.string(),
      name: z.string(),
      type: z.enum(["TEXT", "NUMBER"]),
    }))
    .mutation(async ({ input, ctx }) => {
      return ctx.db.column.create({
        data: {
          tableId: input.tableId,
          name: input.name,
          type: input.type,
        },
      });
    }),
  addRow: protectedProcedure
    .input(z.object({
      tableId: z.string(),
      data: z.record(z.any()),
    }))
    .mutation(async ({ input, ctx }) => {
      return ctx.db.row.create({
        data: {
          tableId: input.tableId,
          data: input.data,
        },
      });
    }),
  updateCell: protectedProcedure
    .input(z.object({
      rowId: z.string(),
      columnKey: z.string(),
      value: z.union([z.string(), z.number()])
    }))
    .mutation(async ({ input, ctx }) => {
      const existingRow = await ctx.db.row.findUnique({
        where: { id: input.rowId },
      });

      if (!existingRow) {
        throw new Error('Row not found');
      }
      
      if (typeof existingRow.data !== 'object' || existingRow.data === null || Array.isArray(existingRow.data)) {
        throw new Error('Row data is not a valid object');
      }

      const updatedData = {
        ...existingRow.data,
        [input.columnKey]: input.value,
      };

      return ctx.db.row.update({
        where: { id: input.rowId },
        data: { data: updatedData },
      });
    }),
});
