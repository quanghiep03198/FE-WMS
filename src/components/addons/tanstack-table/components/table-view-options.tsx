'use no memo'

import { cn } from '@common/utils/cn'
import { useUpdate } from 'ahooks'
import { useTranslation } from 'react-i18next'
import { Tooltip } from '../../../customs/tooltip'
import { buttonVariants } from '../../../ui/button'
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '../../../ui/dropdown-menu'
import { Icon } from '../../../ui/icon'
import { useTableContext } from '../context/table.context'

export const TableViewOptions: React.FC = () => {
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
				<DropdownMenuLabel>{t('ns_common:table.toggle_columns')}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{table
					.getAllLeafColumns()
					.filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
					.map((column) => {
						return (
							<DropdownMenuCheckboxItem
								checked={column.getIsVisible()}
								className='whitespace-nowrap capitalize'
								key={column.id}
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
