export type Conjunction = 'and' | 'or';

// OPERATORS
export type TextOperator =
  | 'contains'
  | 'does not contain'
  | 'is'
  | 'is not'
  | 'is empty'
  | 'is not empty';

export type NumberOperator =
  | '>'
  | '>='
  | '<'
  | '<='
  | '='
  | '!='
  | 'is empty'
  | 'is not empty';

export type Operator = TextOperator | NumberOperator;

// FILTERS
export type FilterCondition = {
  field: string;
  operator: Operator;
  value: string;
}

export type FilterBoxProps = {
  index: number;
  filter: FilterCondition;
  updateFilter: (index: number, updated: Partial<FilterCondition>) => void;
  deleteFilter: (index: number) => void;
  conjunction: Conjunction;
  setConjunction: (value: Conjunction) => void;
}

export type FirstFilterBoxProps = {
  index: number;
  filter: FilterCondition;
  updateFilter: (index: number, updated: Partial<FilterCondition>) => void;
  deleteFilter: (index: number) => void;
}

// MISC
export type DropdownProps<T extends string> = {
  value: T;
  onChange: (value: T) => void;
}

export type ValueInputProps = {
  value: string;
  onChange: (value: string) => void;
}

export type DeleteProps = {
  onClick: () => void;
}
