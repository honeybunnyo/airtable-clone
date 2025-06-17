import React, { useEffect, useState } from 'react'
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
import { useParams } from 'next/navigation'
import { api } from '~/trpc/react'

const Filter = () => {
	const [conjunction, setConjunction] = useState<Conjunction>('and');
  const params = useParams();
  const tableId = typeof params?.tableId === 'string' ? params.tableId : '';

	// TODO: trpc: get first field from columns
	// TODO: Remove intial default filters & only add when
	// Add condition button is clicked

  const { data: columns } = api.table.getTableColumns.useQuery({ tableId });
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  // Early returns must come after hooks

  useEffect(() => {
    if (columns?.[0] && filters.length === 0) {
      setFilters([{ field: columns[0].name, operator: 'contains', value: '' }]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns]);

  const { data: filterResult } = api.filter.filter.useQuery({
    tableId,
    filter: {
      conjunction,
      conditions: filters.map((filter) => ({
        field: filter.field,
        operator: filter.operator,
        value: filter.value,
      })),
    },
  });

  useEffect(() => {
    console.log('filters updated', filters);
    console.log('filter result', filterResult);
  }, [filters, filterResult]);
	// Update filter configuration
	const updateFilter = (index: number, updated: Partial<FilterCondition>) => {
    setFilters((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...updated } as FilterCondition;
      return next;
    });
  }

  if (!tableId || !columns?.[0]) return null;

  const addFilter = () => {
    if (!columns[0]) return;
    const firstColumn = columns[0];
    if (!firstColumn) return;
    setFilters((prev) => [
      ...prev,
      { field: firstColumn.name, operator: 'contains', value: '' }
    ]);
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
              <FirstFilterBox key={index} index={index} filter={filter} columns={columns} updateFilter={updateFilter} deleteFilter={deleteFilter}/>
            ) : (
              <FilterBox key={index} index={index} filter={filter} columns={columns} updateFilter={updateFilter} deleteFilter={deleteFilter} conjunction={conjunction} setConjunction={setConjunction}/>
            )
          )}
          <Button variant="ghost" className="w-30" onClick={addFilter}>+ Add condition</Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default Filter