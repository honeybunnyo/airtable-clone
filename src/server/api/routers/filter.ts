import { fi } from "@faker-js/faker";
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
            row: { tableId: input.tableId },
            value: {
              contains: input.searchValue,
              mode: 'insensitive',
            },
          },
          select: {
            id: true,
            row: { select: { order: true } },
            column: { select: { order: true } },
          },
          orderBy: [
            { row: { order: 'asc' } },
            { column: { order: 'asc' } },
          ],
        }),
        ctx.db.column.findMany({
          where: {
            tableId: input.tableId,
            name: {
              contains: input.searchValue,
              mode: 'insensitive',
            },
          },
          select: { id: true },
        }),
      ]);
      return { matchingCells, matchingColumns };
    }),

  // type FilterCondition = {
  //   field: string;
  //   operator: Operator;
  //   value: string;
  // }
  
  // STUB
  filter: protectedProcedure
    .input(z.object({
      tableId: z.string(),
      filter: z.object({
        conjunction: z.string().optional(),
        conditions: z.array(z.object({
          field: z.string(),
          operator: z.string(),
          value: z.string(),
        })),
      })
    }))
    // tableid,
    // filter: { and/or, conditions: [{ field, operator, value }] }
    .query(async ({ ctx, input }) => {
      const conditions = input.filter.conditions.map(condition => ({
        column: { name: condition.field },
        value: {
          contains: condition.value,
          mode: 'insensitive',
        },
      }));

      // Build filter conditions for Prisma
      const conjunction = input.filter.conjunction === 'or' ? 'OR' : 'AND';
      const filterConditions = input.filter.conditions.map(condition => ({
        column: { name: condition.field },
        value: {
          contains: condition.value,
          mode: 'insensitive',
        },
      }));

      const results = await ctx.db.cell.findMany({
        where: {
          row: {
            tableId: input.tableId,
          },
          [conjunction]: filterConditions,
        },
        select: {
          value: true,
          row: { select: { order: true } },
          column: { select: { order: true } },
        },
        orderBy: [
          { row: { order: 'asc' } },
          { column: { order: 'asc' } },
        ],
      });
      return { results };
    })
  })