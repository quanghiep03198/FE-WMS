import { ColumnDefBase } from '@tanstack/react-table'
import React from 'react'
import { Checkbox } from '../../@shadcn/checkbox'

type RowSelectionCheckboxProps<TData> = Partial<Parameter<ColumnDefBase<TData>['cell']>> &
	React.ComponentProps<typeof Checkbox>

export function RowSelectionCheckbox<TData>({
	row,
	checked,
	disabled,
	onCheckedChange
}: RowSelectionCheckboxProps<TData>) {
	return (
		<Checkbox
			aria-label='Select row'
			role='checkbox'
			disabled={disabled}
			checked={checked ?? row.getIsSelected()}
			onCheckedChange={(checked) => {
				row.toggleSelected(Boolean(checked))
				if (typeof onCheckedChange === 'function') onCheckedChange(checked)
			}}
		/>
	)
}
