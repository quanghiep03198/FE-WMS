'use no memo'

import { Tooltip } from '@components/customs/tooltip'
import { Button } from '@components/ui/button'
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator
} from '@components/ui/dropdown-menu'
import { Icon } from '@components/ui/icon'
import useMediaQuery from '@hooks/use-media-query'
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { type Table, type VisibilityState } from '@tanstack/react-table'
import { useLocalStorageState } from 'ahooks'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { type ITruckloadDelivery } from '../types'

export function TableViewOptions({ table }: { table: Table<ITruckloadDelivery> }) {
	const { t } = useTranslation()
	const [, setStoredHiddenState] = useLocalStorageState<VisibilityState>('truckloadDeliveryTableColumnVisibility', {
		defaultValue: { dispatch_order: false },
		listenStorageChange: true
	})
	const isMobile = useMediaQuery('(max-width: 1023px)')

	useEffect(() => {
		setStoredHiddenState(table.getState().columnVisibility)
	}, [table.getState().columnVisibility])

	if (isMobile) return null

	return (
		<DropdownMenu>
			<Tooltip contentProps={{ hidden: !isMobile }} message={t('ns_common:table.column_settings')}>
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
								checked={column.getIsVisible()}
								className='capitalize'
								key={column.id}
								onSelect={(e) => e.preventDefault()}
								onCheckedChange={(value) => {
									column.toggleVisibility(!!value)
									// setStoredHiddenState((prev) => ({ ...prev, [column.id]: value }))
								}}>
								{column.columnDef.header?.toString()}
							</DropdownMenuCheckboxItem>
						)
					})}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
