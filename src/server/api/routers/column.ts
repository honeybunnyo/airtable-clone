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
      return ctx.db.column.delete({
        where: { id: input.columnId },
      });
    }),
});
