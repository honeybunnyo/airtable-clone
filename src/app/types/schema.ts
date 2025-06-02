// types/schema.ts

import type { ColumnType } from "@prisma/client"
import type { JsonValue } from "@prisma/client/runtime/library"

export type Base = {
  id: string
  name: string
  userId: string
  createdAt: Date
  updatedAt: Date
  tables: Table[]
}

export type Table = {
  id: string
  name: string
  baseId: string
  columns: Column[]
  rows: Row[]
}

export type Column = {
  id: string
  name: string
  type: ColumnType
  tableId: string
}

export type Row = {
  id: string
  tableId: string
  data: JsonValue
}
