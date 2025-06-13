import React, { useState } from 'react'
import { api } from '~/trpc/react';
import { withGlobalSaving } from '~/lib/utils';

type MatchingCell = {
  id: string
};

const DataTableCell = ({
  initialValue,
  cellId,
  columnType,
  matchingCells = []
}: {
  initialValue: string;
  cellId: string;
  columnType: 'TEXT' | 'NUMBER';
  matchingCells: MatchingCell[];
}) => {
  const [value, setValue] = useState(initialValue);
  const updateCellMutation = api.table.updateCell.useMutation();

  const updateCell = async (value: string | number) => {
    await withGlobalSaving(() => updateCellMutation.mutateAsync({
        cellId,
        value,
      })
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (columnType === 'NUMBER') {
      if (
        inputValue === '' ||
        /^-?\d*\.?\d*$/.test(inputValue)
      ) {
        setValue(inputValue);
      }
    } else {
      setValue(inputValue);
    }
  };
  const isHighlighted = matchingCells.some((mc) => mc.id === cellId);

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      onBlur={() => {
        if (value !== initialValue) {
          void updateCell(value);
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
        className={`w-full h-full bg-transparent focus:outline-blue-500 p-1 ${
        isHighlighted ? 'bg-yellow-200' : ''
      }`}
      />
  )
}

export default DataTableCell