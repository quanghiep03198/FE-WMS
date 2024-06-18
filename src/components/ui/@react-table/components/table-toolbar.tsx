import { Table } from '@tanstack/react-table'
import React, { useContext } from 'react'
import { Div, Button, Icon, Toggle, Tooltip } from '../..'
import { TableContext } from '../context/table.context'
import { GlobalFilter, GlobalFilterPopover } from './global-filter'
import { TableViewOptions } from './table-view-options'
import { cn } from '@/common/utils/cn'
import { useTranslation } from 'react-i18next'

type TableToolbarProps<TData> = {
	table: Table<TData>
	globalFilter: string
	isFilterDirty: boolean
	onGlobalFilterChange: React.Dispatch<React.SetStateAction<string>>
	onResetFilters: () => void
	slot?: React.ReactNode
}

export default function TableToolbar<TData>(props: TableToolbarProps<TData>) {
	const { table, globalFilter, isFilterDirty, slot, onGlobalFilterChange, onResetFilters: onClearAllFilters } = props
	const { isFilterOpened, setIsFilterOpened } = useContext(TableContext)
	const { t } = useTranslation('ns_common')

	return (
		<Div className='flex items-center justify-between sm:justify-end'>
			<GlobalFilter table={table} globalFilter={globalFilter} onGlobalFilterChange={onGlobalFilterChange} />

			<Div className='grid grid-flow-col items-center gap-x-1'>
				<Tooltip message={t('ns_common:actions.clear_filter')}>
					<Button
						variant='destructive'
						size='icon'
						onClick={onClearAllFilters}
						className={cn(!isFilterDirty && 'hidden')}>
						<Icon name='X' />
					</Button>
				</Tooltip>

				<GlobalFilterPopover
					table={table}
					globalFilter={globalFilter}
					onGlobalFilterChange={onGlobalFilterChange}
				/>
				<Tooltip message={t('ns_common:table.filter')}>
					<Button
						variant={isFilterOpened ? 'secondary' : 'outline'}
						onClick={() => setIsFilterOpened(!isFilterOpened)}
						disabled={!table.getAllColumns().some(({ columnDef }) => columnDef.enableColumnFilter)}
						size='icon'>
						<Icon name={isFilterOpened ? 'FilterX' : 'Filter'} />
					</Button>
				</Tooltip>
				<TableViewOptions table={table} />
				{slot}
			</Div>
		</Div>
	)
}
