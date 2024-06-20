import { ColumnDefTemplate, CellContext, ColumnDefBase, Row } from '@tanstack/react-table'
import React from 'react'
import { Checkbox } from '../../@shadcn/checkbox'

type RowSelectionCheckboxProps<TData> = Partial<Parameter<ColumnDefBase<TData>['cell']>> &
	Omit<React.ComponentProps<typeof Checkbox>, 'onCheckedChange'>

export function RowSelectionCheckbox<TData>({ row, checked }: RowSelectionCheckboxProps<TData>) {
	return (
		<Checkbox
			aria-label='Select row'
			role='checkbox'
			checked={checked ?? row.getIsSelected()}
			onCheckedChange={(checked) => row.toggleSelected(Boolean(checked))}
		/>
	)
}
