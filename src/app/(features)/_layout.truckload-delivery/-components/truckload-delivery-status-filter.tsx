'use no memo'

import { cn } from '@/common/utils/cn'
import {
	Badge,
	buttonVariants,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Icon
} from '@/components/ui'
import { ITruckloadDelivery } from '@/services/truckload-delivery.service'
import { Table } from '@tanstack/react-table'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { TruckloadDeliveryStatus } from '../-constants'

const StatusDropdownMenu: React.FC<{ table: Table<ITruckloadDelivery> }> = ({ table }) => {
	const { t } = useTranslation()

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger className={cn(buttonVariants({ variant: 'outline', className: 'border-dashed' }))}>
				<Icon name='CirclePlus' /> {t('ns_common:common_fields.status')}
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-64' align='end'>
				<DropdownMenuRadioGroup
					value={table.getColumn('status').getFilterValue() as string}
					onValueChange={(value) => table.getColumn('status').setFilterValue(value)}>
					<DropdownMenuRadioItem value={TruckloadDeliveryStatus.PENDING} className='gap-x-2'>
						<Icon name='CircleDotDashed' />
						{t('ns_common:status.pending')}
						<Badge variant='outline' className='ml-auto font-normal'>
							{table.options.data.filter((item) => item.status === TruckloadDeliveryStatus.PENDING).length}
						</Badge>
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value={TruckloadDeliveryStatus.CONFIRMED} className='gap-x-2'>
						<Icon name='CircleCheckBig' />
						{t('ns_common:status.confirmed')}
						<Badge variant='outline' className='ml-auto font-normal'>
							{table.options.data.filter((item) => item.status === TruckloadDeliveryStatus.PENDING).length}
						</Badge>
					</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					disabled={!table.getColumn('status').getFilterValue()}
					className='justify-center gap-x-2'
					onClick={() => table.getColumn('status').setFilterValue(null)}>
					<Icon name='X' />
					{t('ns_common:actions.clear_filter')}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default StatusDropdownMenu
