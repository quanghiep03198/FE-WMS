import { cn } from '@/common/utils/cn'
import { Table } from '@tanstack/react-table'
import React, { Fragment, useCallback, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Div, Icon, Tooltip } from '../..'
import { TableContext } from '../context/table.context'
import { GlobalFilter, GlobalFilterPopover } from './global-filter'
import { TableViewOptions } from './table-view-options'

type TableToolbarProps<TData> = {
	table: Table<TData>
	slot?: React.ReactNode
}

export default function TableToolbar<TData>({ table, slot }: TableToolbarProps<TData>) {
	const { globalFilter, columnFilters } = useContext(TableContext)

	const { isFilterOpened, setIsFilterOpened } = useContext(TableContext)
	const { t } = useTranslation('ns_common')

	const isFilterDirty = globalFilter.length !== 0 || columnFilters.length !== 0

	// Reset all of current filters
	const resetAllFilters = useCallback(() => {
		table.resetGlobalFilter(table.initialState.globalFilter)
		table.resetColumnFilters(true)
	}, [])

	return (
		<Div className='flex items-center justify-between sm:justify-end'>
			<GlobalFilter />

			<Div className='grid auto-cols-fr grid-flow-col items-center gap-x-1'>
				<Tooltip message={t('ns_common:actions.clear_filter')} triggerProps={{ asChild: true }}>
					<Button
						variant='destructive'
						size='icon'
						onClick={resetAllFilters}
						className={cn(!isFilterDirty && 'hidden')}>
						<Icon name='X' />
					</Button>
				</Tooltip>

				<Fragment>{slot}</Fragment>

				<GlobalFilterPopover />

				<Tooltip message={t('ns_common:table.filter')} triggerProps={{ asChild: true }}>
					<Button
						variant={isFilterOpened ? 'secondary' : 'outline'}
						onClick={() => setIsFilterOpened(!isFilterOpened)}
						disabled={!table.getAllColumns().some(({ columnDef }) => columnDef.enableColumnFilter)}
						size='icon'>
						<Icon name={isFilterOpened ? 'FilterX' : 'Filter'} />
					</Button>
				</Tooltip>
				<TableViewOptions table={table} />
			</Div>
		</Div>
	)
}
