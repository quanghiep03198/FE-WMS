'use no memo'

import { RecordStatus } from '@common/constants/enums'
import { cn } from '@common/utils/cn'
import type { IconProps } from '@components/ui'
import {
	Badge,
	buttonVariants,
	Div,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	Icon,
	Separator
} from '@components/ui'
import type { IUser } from '@features/auth/types'
import type { Table } from '@tanstack/react-table'
import { isNil } from 'lodash-es'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

type DropdownOption = { label: string; value: RecordStatus; icon: IconProps['name']; count: number }

const UserStatusFilter: React.FC<{ table: Table<IUser> }> = ({ table }) => {
	const { t, i18n } = useTranslation()

	const { data } = table.options

	const currentFilterValue = table.getColumn('is_active').getFilterValue()

	const dropdownOptions: DropdownOption[] = useMemo(
		() =>
			[
				{
					label: String(t('ns_common:status.active')),
					value: RecordStatus.ACTIVE,
					icon: 'CircleCheckBig'
				},
				{
					label: String(t('ns_common:status.deactivated')),
					value: RecordStatus.INACTIVE,
					icon: 'CircleMinus'
				}
			].map((item: DropdownOption) => ({
				...item,
				count: data.filter((user) =>
					user.is_active ? item.value === RecordStatus.ACTIVE : item.value === RecordStatus.INACTIVE
				).length
			})),
		[data, i18n.language]
	)

	const handleValueChange = (value: RecordStatus) => {
		table.getColumn('is_active').setFilterValue(value === RecordStatus.ACTIVE)
		// setParams({ ...searchParams, status: value as TruckloadDeliveryStatus })
	}

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger className={cn(buttonVariants({ variant: 'outline', className: 'border-dashed' }))}>
				<Icon name='CirclePlus' /> {t('ns_common:common_fields.status')}
				{typeof currentFilterValue === 'boolean' && (
					<Div className='inline-flex items-center md:hidden'>
						<Separator orientation='vertical' className='mx-2 h-4' />{' '}
						<Badge variant='secondary' className='mx-1 rounded-sm px-1.5 font-normal'>
							{currentFilterValue ? t('ns_common:status.active') : t('ns_common:status.deactivated')}
						</Badge>
					</Div>
				)}
			</DropdownMenuTrigger>
			<DropdownMenuContent className='w-64' align='end'>
				<DropdownMenuRadioGroup
					value={
						isNil(currentFilterValue) ? null : currentFilterValue ? RecordStatus.ACTIVE : RecordStatus.INACTIVE
					}
					onValueChange={handleValueChange}>
					{dropdownOptions.map((option) => (
						<DropdownMenuRadioItem key={option.value} value={option.value} className='gap-x-2'>
							<Icon
								name={option.icon}
								className={cn({
									'stroke-success': option.value === RecordStatus.ACTIVE,
									'stroke-muted-foreground': option.value === RecordStatus.INACTIVE
								})}
							/>
							{option.label}
							<Badge variant='outline' className='ml-auto font-normal'>
								{option.count}
							</Badge>
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					disabled={!table.getColumn('is_active').getFilterValue()}
					className='justify-center gap-x-2'
					onClick={() => table.getColumn('is_active').setFilterValue(null)}>
					<Icon name='X' />
					{t('ns_common:actions.clear_filter')}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default UserStatusFilter
