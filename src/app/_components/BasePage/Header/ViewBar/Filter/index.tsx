import React, { useState } from 'react'
import FormatIcon from '../Common/FormatIcon'
import { ListFilter } from 'lucide-react'
import { Button } from "~/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { FilterBox, FirstFilterBox } from './FilterBox'
import type { Conjunction, FilterCondition } from './type'

const Filter = () => {
	const [conjunction, setConjunction] = useState<Conjunction>('and');

	// TODO: trpc: get first field from columns
	// TODO: Remove intial default filters & only add when
	// Add condition button is clicked
	const [filters, setFilters] = useState<FilterCondition[]>([
    { field: 'Name', operator: 'contains', value: '' },
  ]);

	// Update filter configuration
	const updateFilter = (index: number, updated: Partial<FilterCondition>) => {
    setFilters((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...updated } as FilterCondition;
      return next;
    });
    console.log('filters', filters)
  }

	// TODO: REPLACE 'NAME' TO BE FIRST FIELD
	const addFilter = () => {
    setFilters((prev) => [...prev, { field: 'Name', operator: 'contains', value: ''}]);
  }

  const deleteFilter = (index: number) => {
    setFilters((prev) => prev.filter((_, i) => i !== index));
  }

  return (
		<Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="flex items-center justify-center gap-1 h-6 p-0 rounded-xs">
          <FormatIcon icon={ListFilter} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-150 mt-1" side="bottom" align="start">
        <div className="grid gap-4">
          <p className="text-muted-foreground text-sm">In this view, show records</p>
          {filters.map((filter, index) =>
            index === 0 ? (
              <FirstFilterBox key={index} index={index} filter={filter} updateFilter={updateFilter} deleteFilter={deleteFilter}/>
            ) : (
              <FilterBox key={index} index={index} filter={filter} updateFilter={updateFilter} deleteFilter={deleteFilter} conjunction={conjunction} setConjunction={setConjunction}/>
            )
          )}
          <Button variant="ghost" className="w-30" onClick={addFilter}>+ Add condition</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default Filter