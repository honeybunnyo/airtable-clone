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
      const table = await ctx.db.table.create({
        data: {
          name: input.name,
          base: { connect: { id: input.baseId } },
          columns: {
            create: [
              { name: 'name', type: 'TEXT', order: 0 },
              { name: 'email', type: 'TEXT', order: 1 },
            ],
          },
        },
        include: { columns: true }
      });

      const initialRows = [
        { name: 'Alice', email: 'alice@example.com', order: 0 },
        { name: 'Bob', email: 'bob@example.com', order: 1},
        { name: 'Charlie', email: 'charlie@example.com', order: 2 },
      ];

      for (const [index, row] of initialRows.entries()) {
        const newRow = await ctx.db.row.create({
          data: {
            tableId: table.id,
            order: index,
          },
        });

        const cellData = Object.entries(row);
        for (const [columnName, value] of cellData) {
          if (typeof value !== "string" && typeof value !== "number") continue;
          const column = table.columns.find((c) => c.name === columnName);
          if (column) {
            await ctx.db.cell.create({
              data: {
                rowId: newRow.id,
                columnId: column.id,
                value,
              },
            });
          }
        }
      }
      return { tableId: table.id }
    }),
  getTableById: publicProcedure
    .input(z.object({ tableId: z.string() }))
    .query(async ({ input, ctx }) => {
      return ctx.db.table.findUnique({
        where: { id: input.tableId },
        include: {
          columns: true,
          rows: {
            orderBy: {
              order: 'asc',
            },
            include: {
              cells: true,
            },
          },
        },
      });
    }),
  addRow: protectedProcedure
    .input(z.object({
      tableId: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const columns = await ctx.db.column.findMany({
        where: { tableId: input.tableId },
      });

      const maxOrderRow = await ctx.db.row.findFirst({
        where: { tableId: input.tableId },
        orderBy: { order: 'desc' },
        select: { order: true },
      });
      const nextOrder = (maxOrderRow?.order ?? -1) + 1;

      const newRow = await ctx.db.row.create({
        data: {
          tableId: input.tableId,
          order: nextOrder,
        },
      });

      await ctx.db.cell.createMany({
        data: columns.map(col => ({
          rowId: newRow.id,
          columnId: col.id,
          value: '',
        })),
      });

      return newRow;
    }),
  updateCell: protectedProcedure
    .input(z.object({
      cellId: z.string(),
      value: z.union([z.string(), z.number()]),
    }))
    .mutation(async ({ input, ctx }) => {
      return ctx.db.cell.update({
        where: { id: input.cellId },
        data: { value: input.value },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const tableId = input.id;
      const rows = await ctx.db.row.findMany({ where: { tableId } });
      const rowIds = rows.map(row => row.id);

      await ctx.db.cell.deleteMany({
        where: { rowId: { in: rowIds } },
      });
      await ctx.db.row.deleteMany({ where: { tableId } });
      await ctx.db.column.deleteMany({ where: { tableId } });

      return ctx.db.table.delete({ where: { id: tableId } });
    }),
  addManyRows: protectedProcedure
    .input(z.object({
      tableId: z.string(),
      rows: z.array(z.object({
        data: z.record(z.string(), z.union([z.string(), z.number()])),
      })),
    }))
  .mutation(async ({ ctx, input }) => {
    return await ctx.db.$transaction(async (tx) => {
      const columns = await tx.column.findMany({
        where: { tableId: input.tableId },
      });

      const maxOrderRow = await tx.row.findFirst({
        where: { tableId: input.tableId },
        orderBy: { order: 'desc' },
        select: { order: true },
      });

      const startOrder = (maxOrderRow?.order ?? -1) + 1;

      const rowsToCreate = input.rows.map((_, index) => ({
        tableId: input.tableId,
        order: startOrder + index,
      }));

      const createdRows = await tx.row.createManyAndReturn({
        data: rowsToCreate,
      });

      const cellsToCreate: { rowId: string; columnId: string; value: string; }[] = [];
      
      createdRows.forEach((createdRow, rowIndex) => {
        columns.forEach((col) => {
          const value = input.rows[rowIndex]?.data[col.name] ?? "";
          cellsToCreate.push({
            rowId: createdRow.id,
            columnId: col.id,
            value: typeof value === 'string' ? value : String(value),
          });
        });
      });

      await tx.cell.createMany({
        data: cellsToCreate,
      });

      return { success: true, rowsCreated: createdRows.length };
    });
  }),
  getPaginatedRows: publicProcedure
  .input(
    z.object({
      tableId: z.string(),
      limit: z.number(),
      cursor: z.number().optional(),
    })
  )
  .query(async ({ input, ctx }) => {
    const { tableId, limit, cursor } = input
    const rows = await ctx.db.row.findMany({
      where: { 
        tableId,
        ...(cursor !== undefined ? { order: { gt: cursor } } : {})
      },
      orderBy: { order: 'asc' },
      include: {
        cells: {
          orderBy: { column: { order: 'asc' } },
          include: { column: true },
        },
      },
      take: limit,
    })
    const lastRow = rows[rows.length - 1]

    return {
      rows,
      hasMore: rows.length === limit,
      nextCursor: lastRow?.order,
    }
  }),
  getTableColumns: publicProcedure
  .input(z.object({ tableId: z.string() }))
  .query(async ({ input, ctx }) => {
    const { tableId } = input

    const columns = await ctx.db.column.findMany({
      where: { tableId },
      orderBy: { order: 'asc' },
    })

    return columns
  }),
  getRowCount: publicProcedure
    .input(z.object({ tableId: z.string() }))
    .query(async ({ input, ctx }) => {
      const count = await ctx.db.row.count({
        where: {
          tableId: input.tableId,
        },
      })
      return { count }
    }),
});
