import React, { useState } from 'react'
import { api } from '~/trpc/react';
import { withGlobalSaving } from '~/lib/utils';
import type { DataTableCellProps } from '~/app/types/props';
import { useEditedCellsStore } from '~/lib/stores/useEditedStore';

const DataTableCell = ({
  initialValue,
  cellId,
  columnType,
  matchingCells = []
}: DataTableCellProps) => {
  const { setEditedCell, getEditedValue, clearEditedCell } = useEditedCellsStore();

  const storeValue = getEditedValue(cellId);
  const [value, setValue] = useState(storeValue ?? initialValue);
  const updateCellMutation = api.table.updateCell.useMutation();
  const isTempColumnId = (columnId: string) => columnId.includes('temp-');

  // If temp cell, add to editCells store
  const updateCell = async (value: string) => {
    if (isTempColumnId(cellId)) {
      setEditedCell(cellId, value);
      return;
    }

    await withGlobalSaving(() =>
      updateCellMutation.mutateAsync({ cellId, value })
    );
    clearEditedCell(cellId);
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (columnType === 'NUMBER') {
      if (
        inputValue === '' ||
        /^-?\d*\.?\d*$/.test(inputValue)
      ) {
        setValue(inputValue);
        setEditedCell(cellId, inputValue);
      }
    } else {
      setValue(inputValue);
      setEditedCell(cellId, inputValue);
    }
  };
  const isHighlighted = matchingCells.some((mc) => mc.id === cellId);
  return (
    <input
      id={cellId}
      type="text"
      value={value}
      onChange={handleChange}
      onBlur={() => {
        if (value !== initialValue) {
          void updateCell(String(value));
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') e.currentTarget.blur();
        if (e.key === 'Tab') {
          e.preventDefault();
          const inputs = Array.from(document.querySelectorAll('td input')).filter(
            (e): e is HTMLInputElement => e instanceof HTMLInputElement
          );
          const index = inputs.indexOf(e.currentTarget);
          const next = e.shiftKey ? inputs[index - 1] : inputs[index + 1];
          next?.focus();
        }
      }}
        className={`w-full h-full focus:outline-blue-500 p-1 text-sm truncate ${
        isHighlighted ? 'bg-[#fff3d2]' : 'bg-white'
      }`}
      />
  )
}

export default DataTableCell
// #fff3d2
// #ffd56f
