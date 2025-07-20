import { CheckedState } from '@radix-ui/react-checkbox'
import { CellContext, HeaderContext, RowData } from '@tanstack/react-table'
import React, { useEffect, useState } from 'react'
import { Checkbox } from '../../@core/checkbox'
import { useTableContext } from '../context/table.context'

type IndeterminateCheckboxProps<TData extends RowData, TValue> = HeaderContext<TData, TValue> &
	React.ComponentProps<typeof Checkbox>

type RowSelectionCheckboxProps<TData extends RowData, TValue> = CellContext<TData, TValue> &
	React.ComponentProps<typeof Checkbox>

export function IndeterminateCheckbox<TData extends RowData, TValue>({
	table,
	onCheckedChange
}: IndeterminateCheckboxProps<TData, TValue>) {
	const { event$ } = useTableContext('table', 'event$')
	const [checked, setChecked] = useState<CheckedState>(false)

	event$.useSubscription((value: { isAllRowsSelected?: CheckedState }) => {
		if (typeof value.isAllRowsSelected === 'boolean' || value.isAllRowsSelected === 'indeterminate')
			setChecked(value.isAllRowsSelected)
	})

	const handleCheckedChange = (checked: CheckedState) => {
		setChecked(checked)
		table.toggleAllRowsSelected(Boolean(checked))
		if (typeof checked === 'boolean') event$.emit({ isAllRowsSelected: checked })
		if (typeof onCheckedChange === 'function') onCheckedChange(checked)
	}

	return <Checkbox checked={checked as CheckedState} onCheckedChange={handleCheckedChange} />
}

export function RowSelectionCheckbox<TData, TValue>({
	row,
	disabled,
	onCheckedChange
}: RowSelectionCheckboxProps<TData, TValue>) {
	const { table, event$ } = useTableContext('table', 'event$')

	const [checkedState, setCheckedState] = useState<CheckedState>(row.getIsSelected())

	useEffect(() => {
		event$.emit({
			isAllRowsSelected: table.getIsAllRowsSelected() || (table.getIsSomeRowsSelected() && 'indeterminate')
		})
	}, [checkedState, row])

	event$.useSubscription((value: { isAllRowsSelected?: true }) => {
		if (typeof value.isAllRowsSelected === 'boolean') setCheckedState(value.isAllRowsSelected)
	})

	const handleCheckedChange = (checked: CheckedState) => {
		setCheckedState(checked)
		row.toggleSelected(Boolean(checked))
		if (typeof onCheckedChange === 'function') onCheckedChange(checked)
	}

	return <Checkbox disabled={disabled} checked={checkedState} onCheckedChange={handleCheckedChange} />
}
