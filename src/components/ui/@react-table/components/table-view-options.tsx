'use no memo'

import { cn } from '@/common/utils/cn'
import { useUpdate } from 'ahooks'
import { useTranslation } from 'react-i18next'
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Icon,
	Tooltip,
	buttonVariants
} from '../..'
import { useTableContext } from '../context/table.context'

export function TableViewOptions() {
	const { table } = useTableContext('table')
	const { t } = useTranslation()
	const rerender = useUpdate()

	return (
		<DropdownMenu>
			<Tooltip message='Columns' triggerProps={{ asChild: true }}>
				<DropdownMenuTrigger className={cn(buttonVariants({ variant: 'outline', size: 'icon' }))}>
					<Icon name='Columns2' />
				</DropdownMenuTrigger>
			</Tooltip>
			<DropdownMenuContent align='end' className='w-56'>
				<DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{table
					.getAllLeafColumns()
					.filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
					.map((column) => {
						return (
							<DropdownMenuCheckboxItem
								key={column.id}
								className='whitespace-nowrap capitalize'
								checked={column.getIsVisible()}
								onCheckedChange={(value) => {
									column.toggleVisibility(!!value)
									rerender()
								}}>
								{column.columnDef.header?.toString()}
							</DropdownMenuCheckboxItem>
						)
					})}
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className='place-content-center gap-x-2 font-medium'
					onClick={() => {
						table.resetColumnVisibility()
						rerender()
					}}>
					<Icon name='Undo2' />
					{t('ns_common:actions.reset')}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
