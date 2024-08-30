import { cn } from '@/common/utils/cn'
import { Table } from '@tanstack/react-table'
import React, { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Div, Icon, Tooltip } from '../..'
import { useTableContext } from '../context/table.context'
import { GlobalFilterPopover } from './global-filter'
import { TableViewOptions } from './table-view-options'

type TableToolbarProps<TData> = {
	table: Table<TData>
	slotLeft?: React.FC<{ table: Table<TData> }>
	slotRight?: React.FC<{ table: Table<TData> }>
}

function TableToolbar<TData>({ table, slotLeft: SlotLeft, slotRight: SlotRight }: TableToolbarProps<TData>) {
	const { isFilterOpened, setIsFilterOpened, globalFilter, columnFilters } = useTableContext()
	const { t } = useTranslation('ns_common')
	const isFilterDirty = globalFilter?.length !== 0 || columnFilters?.length !== 0

	// Reset all of current filters
	const resetAllFilters = useCallback(() => {
		table.resetGlobalFilter(table.initialState.globalFilter)
		table.resetColumnFilters(true)
	}, [])

	return (
		<Div role='toolbar' className='flex items-center justify-between py-0.5'>
			{SlotLeft && <SlotLeft table={table} />}
			<Div className='ml-auto grid auto-cols-fr grid-flow-col items-center gap-x-1'>
				<Tooltip message={t('ns_common:actions.clear_filter')} triggerProps={{ asChild: true }}>
					<Button
						variant='destructive'
						size='icon'
						onClick={resetAllFilters}
						className={cn(!isFilterDirty && 'hidden')}>
						<Icon name='FilterX' />
					</Button>
				</Tooltip>

				{SlotRight && <SlotRight table={table} />}
				<GlobalFilterPopover />
				{table.getAllLeafColumns().some(({ columnDef }) => columnDef.enableColumnFilter) && (
					<Tooltip message={t('ns_common:table.filter')} triggerProps={{ asChild: true }}>
						<Button
							variant={isFilterOpened ? 'secondary' : 'outline'}
							size='icon'
							onClick={() => setIsFilterOpened((prev) => !prev)}>
							<Icon name='Filter' />
						</Button>
					</Tooltip>
				)}
				<TableViewOptions table={table} />
			</Div>
		</Div>
	)
}

export default memo(TableToolbar)
