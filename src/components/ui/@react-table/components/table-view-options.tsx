import { Table } from '@tanstack/react-table';
import {
	Button,
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Icon
} from '../..';
import Tooltip from '../../@override/tooltip';

interface DataTableViewOptionsProps<TData> {
	table: Table<TData>;
}

export function TableViewOptions<TData>({ table }: DataTableViewOptionsProps<TData>) {
	return (
		<DropdownMenu>
			<Tooltip content='View'>
				<DropdownMenuTrigger asChild>
					<Button variant='outline' size='icon' className='h-8 w-8'>
						<Icon name='SlidersHorizontal' />
					</Button>
				</DropdownMenuTrigger>
			</Tooltip>
			<DropdownMenuContent align='end'>
				<DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{table
					.getAllColumns()
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
						);
					})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
