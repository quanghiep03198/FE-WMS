import { cn } from '@common/utils/cn'
import type { Table } from '@tanstack/react-table'
import { pick } from 'lodash-es'
import { useTranslation } from 'react-i18next'
import { Icon, Popover, PopoverContent, PopoverTrigger, Tooltip, buttonVariants } from '../..'
import { DebouncedInput } from '../../@custom/debounced-input'
import { useTableContext } from '../context/table.context'

type GlobalFilterPopoverProps = {
	enableGlobalFilter: boolean
	globalFilter: ReturnType<Table<unknown>['getState']>['globalFilter']
	onGlobalFilterChange: Table<unknown>['setGlobalFilter']
}

export const GlobalFilterPopover: React.FC<GlobalFilterPopoverProps> = ({
	enableGlobalFilter,
	globalFilter,
	onGlobalFilterChange
}) => {
	const { t } = useTranslation()
	const { table, event$ } = useTableContext('table', 'event$')
	if (!enableGlobalFilter) return null

	return (
		<Popover>
			<Tooltip message={t('ns_common:actions.search')} triggerProps={{ asChild: true }}>
				<PopoverTrigger className={cn(buttonVariants({ variant: 'outline', size: 'icon' }))}>
					<Icon name='Search' />
				</PopoverTrigger>
			</Tooltip>
			<PopoverContent align='end' side='left' sideOffset={4} className='relative w-64 p-0'>
				<Icon name='Search' className='absolute top-1/2 left-2 -translate-y-1/2' />
				<DebouncedInput
					value={globalFilter}
					onChange={(value) => {
						event$.emit(pick(table.getState(), ['rowSelection']))
						onGlobalFilterChange(String(value))
					}}
					className='font-lg border p-2 pl-8 placeholder:text-sm'
					placeholder={`${t('ns_common:actions.search')} ...`}
					type='search'
				/>
			</PopoverContent>
		</Popover>
	)
}
