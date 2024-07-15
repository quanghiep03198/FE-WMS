import { ColumnDefBase, HeaderContext } from '@tanstack/react-table'
import React from 'react'
import { Checkbox } from '../../@core/checkbox'
import { CheckboxProps, CheckedState } from '@radix-ui/react-checkbox'
import { useUpdate } from 'ahooks'

type RowSelectionCheckboxProps<TData> = Partial<Parameter<ColumnDefBase<TData>['cell']>> &
	React.ComponentProps<typeof Checkbox>

type IndeterminateCheckboxProps<TData> = {
	onCheckedChange?(checked: CheckedState): void
} & HeaderContext<TData, unknown>

export function IndeterminateCheckbox<TData>({ table, onCheckedChange }: IndeterminateCheckboxProps<TData>) {
	const update = useUpdate()
	const checked = table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')

	return (
		<Checkbox
			role='checkbox'
			checked={checked as CheckedState}
			onCheckedChange={(checkedState) => {
				update()
				table.toggleAllPageRowsSelected(!!checkedState)
				if (typeof onCheckedChange === 'function') onCheckedChange(checkedState)
			}}
		/>
	)
}

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
			checked={checked || row.getIsSelected()}
			onCheckedChange={(checked) => {
				row.toggleSelected(Boolean(checked))
				if (typeof onCheckedChange === 'function') onCheckedChange(checked)
			}}
		/>
	)
}
