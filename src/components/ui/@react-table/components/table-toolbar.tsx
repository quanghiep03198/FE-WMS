'use no memo'

import { cn } from '@/common/utils/cn'
import { Table } from '@tanstack/react-table'
import { useMemoizedFn } from 'ahooks'
import { pick } from 'lodash'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Div, Icon, Tooltip } from '../..'
import { ROW_ACTIONS_COLUMN_ID, ROW_EXPANSION_COLUMN_ID, ROW_SELECTION_COLUMN_ID } from '../constants'
import { useTableContext } from '../context/table.context'
import ColumnFilterToggle from './column-filter-toggle'
import { GlobalFilterPopover } from './global-filter'
import { TableViewOptions } from './table-view-options'

type TableToolbarProps<TData> = {
	slotLeft?: React.FC<{ table?: Table<TData> }>
	slotRight?: React.FC<{ table?: Table<TData> }>
}

function TableToolbar<TData>({ slotLeft: SlotLeft, slotRight: SlotRight }: TableToolbarProps<TData>) {
	const { table, event$ } = useTableContext('table', 'event$')
	const {
		columnPinning: { left, right },
		globalFilter,
		columnFilters
	} = table.getState()

	const { t } = useTranslation('ns_common')
	const isFilterDirty = globalFilter?.length !== 0 || columnFilters?.length !== 0

	const isSomeColumnsPinned =
		left.some((columnId) => columnId !== ROW_SELECTION_COLUMN_ID && columnId !== ROW_EXPANSION_COLUMN_ID) ||
		right.some((columnId) => columnId !== ROW_ACTIONS_COLUMN_ID)

	const resetAllFilters = useMemoizedFn(() => {
		table.resetGlobalFilter(table.initialState.globalFilter)
		table.resetColumnFilters(true)
	})

	return (
		<Div role='toolbar' className='flex items-center justify-between py-0.5'>
			{SlotLeft && <SlotLeft table={table} />}
			<Div className='ml-auto grid auto-cols-fr grid-flow-col items-center gap-x-1'>
				<Tooltip message={t('ns_common:actions.unpin_all_columns')} triggerProps={{ asChild: true }}>
					<Button
						variant='destructive'
						size='icon'
						onClick={() => {
							table.resetColumnPinning()
							event$.emit(pick(table.getState(), ['columnPinning']))
						}}
						className={cn(!isSomeColumnsPinned && 'hidden')}>
						<Icon name='PinOff' />
					</Button>
				</Tooltip>
				<Tooltip message={t('ns_common:actions.clear_filter')} triggerProps={{ asChild: true }}>
					<Button
						variant='destructive'
						size='icon'
						onClick={() => resetAllFilters()}
						className={cn(!isFilterDirty && 'hidden')}>
						<Icon name='FunnelX' />
					</Button>
				</Tooltip>
				{SlotRight && <SlotRight table={table} />}
				<GlobalFilterPopover
					enableGlobalFilter={table.options.enableGlobalFilter}
					globalFilter={table.getState().globalFilter}
					onGlobalFilterChange={table.setGlobalFilter}
				/>
				{table.getAllLeafColumns().some(({ columnDef }) => columnDef.enableColumnFilter) && <ColumnFilterToggle />}
				{(table.getAllLeafColumns().some(({ columnDef }) => columnDef.enableResizing) ||
					table.options.enableColumnResizing) && (
					<Tooltip message={t('ns_common:table.reset_size')} triggerProps={{ asChild: true }}>
						<Button variant='outline' size='icon' onClick={() => table.resetColumnSizing()}>
							<Icon name='FoldHorizontal' size={18} />
						</Button>
					</Tooltip>
				)}
				<TableViewOptions />
			</Div>
		</Div>
	)
}

TableToolbar.displayName = 'TableToolbar'

const MemoizedTableToolbar = memo(TableToolbar) as typeof TableToolbar

export { MemoizedTableToolbar, TableToolbar }
