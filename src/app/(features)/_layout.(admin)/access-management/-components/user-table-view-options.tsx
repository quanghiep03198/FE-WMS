'use no memo'

import {
	Button,
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	Icon
} from '@/components/ui'
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { type Table } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'

export function UserTableViewOptions<TData>({ table }: { table: Table<TData> }) {
	const { t } = useTranslation()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='outline' className='ml-auto flex sm:hidden md:hidden'>
					<Icon name='Settings2' />
					{t('ns_common:table.column_settings')}
				</Button>
			</DropdownMenuTrigger>
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
