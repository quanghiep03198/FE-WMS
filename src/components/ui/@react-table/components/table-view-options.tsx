import { cn } from '@/common/utils/cn'
import { Table } from '@tanstack/react-table'
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Icon,
	Tooltip,
	buttonVariants
} from '../..'

interface DataTableViewOptionsProps<TData> {
	table: Table<TData>
}

export function TableViewOptions<TData>({ table }: DataTableViewOptionsProps<TData>) {
	return (
		<DropdownMenu>
			<Tooltip message='Columns' triggerProps={{ asChild: true }}>
				<DropdownMenuTrigger className={cn(buttonVariants({ variant: 'outline', size: 'icon' }))}>
					<Icon name='SlidersHorizontal' />
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
								onCheckedChange={(value) => column.toggleVisibility(!!value)}>
								{column.columnDef.header?.toString()}
							</DropdownMenuCheckboxItem>
						)
					})}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
