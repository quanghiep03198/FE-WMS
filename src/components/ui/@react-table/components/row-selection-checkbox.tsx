import { CheckedState } from '@radix-ui/react-checkbox'
import { CellContext, HeaderContext, RowData, RowSelectionState, TableState } from '@tanstack/react-table'
import { useUpdate } from 'ahooks'
import { pick } from 'lodash-es'
import React, { useEffect } from 'react'
import { Checkbox } from '../../@core/checkbox'
import { useTableContext } from '../context/table.context'

type IndeterminateCheckboxProps<TData extends RowData> = HeaderContext<TData, unknown> &
	React.ComponentProps<typeof Checkbox>

type RowSelectionCheckboxProps<TData extends RowData> = CellContext<TData, unknown> &
	React.ComponentProps<typeof Checkbox>

export function IndeterminateCheckbox<TData extends RowData>({
	table,
	onCheckedChange
}: IndeterminateCheckboxProps<TData>) {
	const { event$ } = useTableContext('table', 'event$')
	const rerender = useUpdate()

	event$.useSubscription((value: { rowSelection?: RowSelectionState }) => {
		if (typeof value.rowSelection === 'object') {
			rerender()
		}
	})

	const handleCheckedChange = (checked: CheckedState) => {
		table.toggleAllRowsSelected(Boolean(checked))
		if (typeof checked === 'boolean') event$.emit(pick(table.getState(), ['rowSelection']))
		if (typeof onCheckedChange === 'function') onCheckedChange(checked)
	}

	return (
		<Checkbox
			checked={
				(table.getIsAllRowsSelected() ||
					(table.getIsSomeRowsSelected() &&
						table.getFilteredSelectedRowModel().flatRows.length > 0 &&
						'indeterminate')) as CheckedState
			}
			onCheckedChange={handleCheckedChange}
		/>
	)
}

IndeterminateCheckbox.displayName = 'IndeterminateCheckbox'

export function RowSelectionCheckbox<TData extends RowData>({
	row,
	disabled,
	onCheckedChange
}: RowSelectionCheckboxProps<TData>) {
	const { table, event$ } = useTableContext('table', 'event$')
	const rerender = useUpdate()

	useEffect(() => {
		event$.emit(pick(table.getState(), ['rowSelection']))
	}, [row.getIsSelected()])

	event$.useSubscription((value: Partial<Pick<TableState, 'rowSelection'>>) => {
		if (typeof value.rowSelection === 'object') rerender()
	})

	const handleCheckedChange = (checked: CheckedState) => {
		row.toggleSelected(Boolean(checked))
		if (typeof onCheckedChange === 'function') onCheckedChange(checked)
	}

	return <Checkbox disabled={disabled} checked={row.getIsSelected()} onCheckedChange={handleCheckedChange} />
}

RowSelectionCheckbox.displayName = 'RowSelectionCheckbox'
