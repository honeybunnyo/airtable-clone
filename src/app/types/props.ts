


export type MatchingCell = {
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
  isMatchingLoading: boolean;
};

export type SearchBarProps = {
  searchBarOpen: boolean;
  setSearchBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  matchingCells: MatchingCell[];
  isMatchingLoading: boolean;
}

export type ViewSideBarProps = {
  sideBarOpen: boolean;
};

export type DataTableProps = {
  tableId: string;
  matchingCells: MatchingCell[];
};

export type DataTableHeaderProps = {
  columns: Column[];
};

export type Column = {
  id: string;
  type: string;
  name: string;
};

export type ColumnContextMenuProps = {
  children: React.ReactNode;
  columnId: string;
};

export type DataTableCellProps = {
  initialValue: string;
  cellId: string;
  columnType: ColumnType;
  matchingCells: MatchingCell[];
};

export type ColumnType = 'TEXT' | 'NUMBER';
