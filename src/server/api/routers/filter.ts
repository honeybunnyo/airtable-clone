import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const filterRouter = createTRPCRouter({
  search: protectedProcedure
    .input(z.object({ 
      tableId: z.string(),
      searchValue: z.string().min(1),
    }))
    .query(async ({ ctx, input }) => {
      const [matchingCells, matchingColumns] = await Promise.all([
        ctx.db.cell.findMany({
          where: {
            row: {
              tableId: input.tableId,
            },
            value: {
              contains: input.searchValue,
              mode: 'insensitive',
            },
          },
          select: {
            id: true,
          },
        }),
        ctx.db.column.findMany({
          where: {
            tableId: input.tableId,
            name: {
              contains: input.searchValue,
              mode: 'insensitive',
            },
          },
          select: {
            id: true,
          },
        }),
      ]);

      return { matchingCells, matchingColumns };
    }),
});