import type { JsonValue } from "@prisma/client/runtime/library";



type MatchingCell = {
  rowId: string;
  columnId: string;
};

type MatchingColumn = {
  id: string;
};

export type PageProps = {
  sideBarOpen: boolean;
  setSideBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  searchBarOpen: boolean;
  setSearchBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  matchingCells: MatchingCell[];
  matchingColumns: MatchingColumn[];
  isMatchingLoading: boolean;
  scrollToRow: (rowId: string) => void;
};

export type SearchBarProps = {
  searchBarOpen: boolean;
  setSearchBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  matchingCells: MatchingCell[];
  matchingColumns: MatchingColumn[];
  isMatchingLoading: boolean;
  scrollToRow: (rowId: string) => void;
}

export type ViewSideBarProps = {
  sideBarOpen: boolean;
};

export type DataTableProps = {
  tableId: string;
  matchingCells: MatchingCell[];
  matchingColumns: MatchingColumn[];
  setRowIdToIndex: React.Dispatch<React.SetStateAction<Map<string, number>>>;
  scrollRef: React.RefObject<HTMLDivElement> | null;
};

export type DataTableHeaderProps = {
  columns: Column[];
  matchingColumns: MatchingColumn[];
  colToDelete: string;
  setColDelete: React.Dispatch<React.SetStateAction<string>>;
};

export type Column = {
  id: string;
  type: string;
  name: string;
};

export type ColumnContextMenuProps = {
  column: Column;
  setColDelete: React.Dispatch<React.SetStateAction<string>>;
};

export type DataTableCellProps = {
  initialValue: string;
  cellId: string;
  columnType: ColumnType;
  matchingCells: MatchingCell[];
};

type Table = {
  baseId: string;
  name: string;
  id: string;
  sortConfig: JsonValue | null;
}

export type TableContextMenuProps = {
  table: Table;
  tableId: string;
}

export type Cell = {
  id: string
  columnId: string
  value: string
}
export type ColumnType = 'TEXT' | 'NUMBER';
