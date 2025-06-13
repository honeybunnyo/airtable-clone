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
      return await ctx.db.cell.findMany({
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
      });
    }),
});