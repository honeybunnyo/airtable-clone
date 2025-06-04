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
      return ctx.db.column.create({
        data: {
          tableId: input.tableId,
          name: input.name,
          type: input.type,
        },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ columnId: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const column = await ctx.db.column.findUnique({
        where: { id: input.columnId },
      });
      
      console.log("columnid", input.columnId)
      if (!column) throw new Error('Column not found');

      const rows = await ctx.db.row.findMany({
        where: { tableId: column.tableId },
      });

      for (const row of rows) {
        const updatedData = { ...row.data };
        delete updatedData[column.name];

        await ctx.db.row.update({
          where: { id: row.id },
          data: { data: updatedData },
        });
      }

      // Finally delete the column
      return ctx.db.column.delete({
        where: { id: input.columnId },
      });
    }),
});
