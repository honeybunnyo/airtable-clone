import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const tableRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ 
      baseId: z.string(),
      name: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      return ctx.db.table.create({
        data: {
          name: input.name,
          base: { connect: { id: input.baseId } },
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
                  name: 'Alice2',
                  email: 'alice@example.com',
                },
              },
              {
                data: {
                  name: 'Bob2',
                  email: 'bob@example.com',
                },
              },
            ],
          },
        },
      });
    }),
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
