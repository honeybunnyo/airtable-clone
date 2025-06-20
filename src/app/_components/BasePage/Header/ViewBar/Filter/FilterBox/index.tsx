import React from 'react'
import OperatorDropdown, { ConjunctionDropdown, Delete, FieldDropdown, ValueInput } from './Dropdowns';
import type { Conjunction, FilterBoxProps, FirstFilterBoxProps } from '../type';

export const FirstFilterBox = ({ index, filter, columns, updateFilter, deleteFilter }: FirstFilterBoxProps) => (
  <div className="flex flex-row items-center">
    <div className="w-14 text-sm mx-2">
      Where
    </div>
    <FieldDropdown value={filter.field} onChange={(v) => updateFilter(index, { field: v })} columns={columns} />
    <OperatorDropdown value={filter.operator} onChange={(v) => updateFilter(index, { operator: v })} />
    <ValueInput value={filter.value} onChange={(v) => updateFilter(index, { value: v })} />
    <Delete onClick={() => deleteFilter(index)} />
  </div>
)

export const FilterBox = ({ index, filter, columns, updateFilter, deleteFilter, conjunction, setConjunction }: FilterBoxProps) => (
  <div className="flex flex-row">
    <div className="w-14 text-sm mx-2">
      <ConjunctionDropdown
        value={conjunction}
        onChange={(v: Conjunction) => setConjunction(v)}
      />
    </div>
    <FieldDropdown value={filter.field} onChange={(v) => updateFilter(index, { field: v })} columns={columns} />
    <OperatorDropdown value={filter.operator} onChange={(v) => updateFilter(index, { operator: v })} />
    <ValueInput value={filter.value} onChange={(v) => updateFilter(index, { value: v })} />
    <Delete onClick={() => deleteFilter(index)} />
  </div>
)