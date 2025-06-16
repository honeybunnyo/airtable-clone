


type MatchingCell = {
  id: string;
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
};

export type SearchBarProps = {
  searchBarOpen: boolean;
  setSearchBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  matchingCells: MatchingCell[];
  matchingColumns: MatchingColumn[];
  isMatchingLoading: boolean;
}

export type ViewSideBarProps = {
  sideBarOpen: boolean;
};

export type DataTableProps = {
  tableId: string;
  matchingCells: MatchingCell[];
  matchingColumns: MatchingColumn[];
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
  children: React.ReactNode;
  columnId: string;
  setColDelete: React.Dispatch<React.SetStateAction<string>>;
};

export type DataTableCellProps = {
  initialValue: string;
  cellId: string;
  columnType: ColumnType;
  matchingCells: MatchingCell[];
};

export type ColumnType = 'TEXT' | 'NUMBER';
