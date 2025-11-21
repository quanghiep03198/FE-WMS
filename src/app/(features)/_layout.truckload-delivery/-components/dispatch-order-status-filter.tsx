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
	Icon,
	IconProps
} from '@/components/ui'
import { ITruckloadDelivery } from '@/services/truckload-delivery.service'
import { Table } from '@tanstack/react-table'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { TruckloadDeliveryStatus } from '../-constants'

type DropdownOption = { label: string; value: TruckloadDeliveryStatus; icon: IconProps['name']; count: number }

const DispatchOrderStatusFilter: React.FC<{ table: Table<ITruckloadDelivery> }> = ({ table }) => {
	const { t, i18n } = useTranslation()

	const { data } = table.options

	const dropdownOptions: DropdownOption[] = useMemo(
		() =>
			[
				{
					label: String(t('ns_common:status.pending')),
					value: TruckloadDeliveryStatus.PENDING,
					icon: 'CircleDotDashed'
				},
				{
					label: String(t('ns_common:status.confirmed')),
					value: TruckloadDeliveryStatus.CONFIRMED,
					icon: 'CircleCheckBig'
				},
				{
					label: String(t('ns_common:status.request_change')),
					value: TruckloadDeliveryStatus.REQUEST_CHANGE,
					icon: 'Undo2'
				}
			].map((item: DropdownOption) => ({ ...item, count: data.filter((d) => d.status === item.value).length })),
		[data, i18n.language]
	)
	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger className={cn(buttonVariants({ variant: 'outline', className: 'border-dashed' }))}>
				<Icon name='CirclePlus' /> {t('ns_common:common_fields.status')}
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-64' align='end'>
				<DropdownMenuRadioGroup
					value={table.getColumn('status').getFilterValue() as string}
					onValueChange={(value) => table.getColumn('status').setFilterValue(value)}>
					{dropdownOptions.map((option) => (
						<DropdownMenuRadioItem key={option.value} value={option.value} className='gap-x-2'>
							<Icon name={option.icon} />
							{option.label}
							<Badge variant='outline' className='ml-auto font-normal'>
								{option.count}
							</Badge>
						</DropdownMenuRadioItem>
					))}
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

export default DispatchOrderStatusFilter
