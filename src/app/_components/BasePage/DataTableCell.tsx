import React, { useState } from 'react'
import { api } from '~/trpc/react';
import { withGlobalSaving } from '~/lib/utils';
const DataTableCell = ({
  initialValue,
  rowId,
  columnKey,
}: {
  initialValue: string;
  rowId: string;
  columnKey: string;
}) => {
  const [value, setValue] = useState(initialValue);
  const updateCellMutation = api.table.updateCell.useMutation();

  const updateCell = async (rowId: string, columnKey: string, value: string) => {
    await withGlobalSaving(() => updateCellMutation.mutateAsync({
        rowId,
        columnKey,
        value,
      })
    );
  }

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => {
        if (value !== initialValue) {
          void updateCell(rowId, columnKey, value);
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
      className="w-full h-full bg-transparent focus:outline-blue-500 p-1"
    />
  )
}

export default DataTableCell