'use no memo'

import {
	Button,
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	Icon,
	Tooltip
} from '@/components/ui'
import useMediaQuery from '@/hooks/use-media-query'
import { type ITruckloadDelivery } from '@/services/truckload-delivery.service'
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { type Table } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

export function TableViewOptions({ table }: { table: Table<ITruckloadDelivery> }) {
	const { t } = useTranslation()
	const isMobile = useMediaQuery('(max-width: 1023px)')

	if (isMobile) return null

	return (
		<DropdownMenu>
			<Tooltip message={t('ns_common:table.column_settings')} contentProps={{ hidden: !isMobile }}>
				<DropdownMenuTrigger asChild>
					<Button variant='outline'>
						<Icon name='Settings2' />
						{t('ns_common:table.column_settings')}
					</Button>
				</DropdownMenuTrigger>
			</Tooltip>
			<DropdownMenuContent align='end' className='w-60'>
				<DropdownMenuLabel>{t('ns_common:table.toggle_columns')}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{table
					.getAllColumns()
					.filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
					.map((column) => {
						return (
							<DropdownMenuCheckboxItem
								key={column.id}
								className='capitalize'
								checked={column.getIsVisible()}
								onCheckedChange={(value) => column.toggleVisibility(!!value)}>
								{column.columnDef.header?.toString()}
							</DropdownMenuCheckboxItem>
						)
					})}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
