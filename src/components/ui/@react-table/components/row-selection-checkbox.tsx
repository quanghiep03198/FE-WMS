import { CheckedState } from '@radix-ui/react-checkbox'
import { CellContext, HeaderContext } from '@tanstack/react-table'
import React, { useEffect, useState } from 'react'
import { Checkbox } from '../../@core/checkbox'
import { useTableContext } from '../context/table.context'

type RowSelectionState = boolean | 'indeterminate'
type IndeterminateCheckboxProps<TData, TValue> = HeaderContext<TData, TValue> & React.ComponentProps<typeof Checkbox>
type RowSelectionCheckboxProps<TData, TValue> = CellContext<TData, TValue> & React.ComponentProps<typeof Checkbox>

export function IndeterminateCheckbox<TData, TValue>({
	table,

	onCheckedChange
}: IndeterminateCheckboxProps<TData, TValue>) {
	const { event$ } = useTableContext('table', 'event$')
	const [checked, setChecked] = useState<CheckedState>(false)

	event$.useSubscription((value: { rowSelectionState: RowSelectionState }) => {
		if (typeof value.rowSelectionState === 'boolean' || value.rowSelectionState === 'indeterminate')
			setChecked(value.rowSelectionState)
	})

	const handleCheckedChange = (checked: CheckedState) => {
		setChecked(checked)
		table.toggleAllPageRowsSelected(Boolean(checked))
		if (typeof checked === 'boolean') event$.emit({ allPageRowSelected: checked })
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
		const checked = table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
		event$.emit({ rowSelectionState: checked })
	}, [checkedState, row])

	event$.useSubscription((value: { allPageRowSelected: true }) => {
		if (typeof value.allPageRowSelected === 'boolean') setCheckedState(value.allPageRowSelected)
	})

	const handleCheckedChange = (checked: CheckedState) => {
		setCheckedState(checked)
		row.toggleSelected(Boolean(checked))
		if (typeof onCheckedChange === 'function') onCheckedChange(checked)
	}

	return <Checkbox disabled={disabled} checked={checkedState} onCheckedChange={handleCheckedChange} />
}
