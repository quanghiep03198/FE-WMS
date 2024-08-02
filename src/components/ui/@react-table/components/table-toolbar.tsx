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
	slot?: React.FC<{ table: Table<TData> }>
}

function TableToolbar<TData>({ table, slot: Slot }: TableToolbarProps<TData>) {
	const { isFilterOpened, setIsFilterOpened, globalFilter, columnFilters } = useTableContext()
	const { t } = useTranslation('ns_common')
	const isFilterDirty = globalFilter?.length !== 0 || columnFilters?.length !== 0

	// Reset all of current filters
	const resetAllFilters = useCallback(() => {
		table.resetGlobalFilter(table.initialState.globalFilter)
		table.resetColumnFilters(true)
	}, [])

	return (
		<Div className='flex justify-end'>
			<Div role='toolbar' className='grid auto-cols-fr grid-flow-col items-center gap-x-1'>
				<Tooltip message={t('ns_common:actions.clear_filter')} triggerProps={{ asChild: true }}>
					<Button
						variant='destructive'
						size='icon'
						onClick={resetAllFilters}
						className={cn(!isFilterDirty && 'hidden')}>
						<Icon name='X' />
					</Button>
				</Tooltip>
				{Slot && <Slot table={table} />}
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
