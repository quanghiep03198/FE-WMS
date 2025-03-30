'use no memo'

import { CheckedState } from '@radix-ui/react-checkbox'
import { CellContext, HeaderContext } from '@tanstack/react-table'
import { useUpdate } from 'ahooks'
import React from 'react'
import { Checkbox } from '../../@core/checkbox'

type IndeterminateCheckboxProps<TData, TValue> = HeaderContext<TData, TValue> & React.ComponentProps<typeof Checkbox>
type RowSelectionCheckboxProps<TData, TValue> = CellContext<TData, TValue> & React.ComponentProps<typeof Checkbox>

export function IndeterminateCheckbox<TData, TValue>({
	table,
	onCheckedChange
}: IndeterminateCheckboxProps<TData, TValue>) {
	const update = useUpdate()
	const checked = table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')

	return (
		<Checkbox
			role='checkbox'
			checked={checked as CheckedState}
			onCheckedChange={(checked) => {
				update()
				table.toggleAllPageRowsSelected(!!checked)
				if (typeof onCheckedChange === 'function') onCheckedChange(checked)
			}}
		/>
	)
}

export function RowSelectionCheckbox<TData, TValue>({
	row,
	checked,
	disabled,
	onCheckedChange
}: RowSelectionCheckboxProps<TData, TValue>) {
	return (
		<Checkbox
			aria-label='Select row'
			role='checkbox'
			disabled={disabled}
			checked={checked || row.getIsSelected()}
			onCheckedChange={(checked) => {
				row.toggleSelected(Boolean(checked))
				if (typeof onCheckedChange === 'function') onCheckedChange(checked)
			}}
		/>
	)
}
