'use no memo'

import { RecordStatus, UserRole } from '@/common/constants/enums'
import { IUser } from '@/common/types/entities'
import { cn } from '@/common/utils/cn'
import {
	Badge,
	buttonVariants,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	Icon,
	IconProps,
	Popover,
	PopoverTrigger
} from '@/components/ui'
import { Table } from '@tanstack/react-table'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

type DropdownOption = { label: string; value: UserRole; icon: IconProps['name']; count: number }

const UserRoleFilter: React.FC<{ table: Table<IUser> }> = ({ table }) => {
	const { t, i18n } = useTranslation()

	const { data } = table.options

	const dropdownOptions: DropdownOption[] = useMemo(
		() =>
			[
				{
					label: String(t('ns_auth:roles.ADMIN')),
					value: UserRole.ADMIN,
					icon: 'UserCog'
				},
				{
					label: String(t('ns_auth:roles.MANAGER')),
					value: UserRole.ADMIN,
					icon: 'UserCog'
				},
				{
					label: String(t('ns_auth:roles.FG_WAREHOUSE_STAFF')),
					value: UserRole.FG_WAREHOUSE_STAFF,
					icon: 'User'
				},
				{
					label: String(t('ns_auth:roles.DG_WAREHOUSE_STAFF')),
					value: UserRole.DG_WAREHOUSE_STAFF,
					icon: 'User'
				},
				{
					label: String(t('ns_auth:roles.IE_STAFF')),
					value: UserRole.IE_STAFF,
					icon: 'User'
				},
				{
					label: String(t('ns_auth:roles.SECURITY_GUARD')),
					value: UserRole.SECURITY_GUARD,
					icon: 'User'
				}
			].map((item: DropdownOption) => ({
				...item,
				count: data.filter((user) => user.role === item.value).length
			})),
		[data, i18n.language]
	)

	const handleValueChange = (value: RecordStatus) => {
		table.getColumn('roles').setFilterValue(value === RecordStatus.ACTIVE)
	}

	return (
		<Popover modal={false}>
			<PopoverTrigger className={cn(buttonVariants({ variant: 'outline', className: 'border-dashed' }))}>
				<Icon name='CirclePlus' /> {t('ns_auth:fields.role')}
			</PopoverTrigger>
			<DropdownMenuContent className='w-80' align='end'>
				<DropdownMenuRadioGroup
					value={table.getColumn('roles').getFilterValue() ? RecordStatus.ACTIVE : RecordStatus.INACTIVE}
					onValueChange={handleValueChange}>
					{dropdownOptions.map((option) => (
						<DropdownMenuRadioItem key={option.value} value={option.value} className='gap-x-2'>
							<Icon name={option.icon} size={18} className='stroke-muted-foreground' />
							{option.label}
							<Badge variant='outline' className='ml-auto font-normal'>
								{option.count}
							</Badge>
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					disabled={!table.getColumn('roles').getFilterValue()}
					className='justify-center gap-x-2'
					onClick={() => table.getColumn('roles').setFilterValue(null)}>
					<Icon name='X' />
					{t('ns_common:actions.clear_filter')}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</Popover>
	)
}

export default UserRoleFilter
