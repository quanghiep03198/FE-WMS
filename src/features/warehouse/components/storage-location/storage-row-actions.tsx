import { UserRole } from '@common/constants/enums'
import RoleBaseAccessControl from '@components/guards/role-base-access-control'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Icon } from '@components/ui'
import type { IWarehouseStorage } from '@features/warehouse/types'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import type { Row } from '@tanstack/react-table'
import React from 'react'
import { useTranslation } from 'react-i18next'

type WarehouseRowActionsProps = {
	row: Row<IWarehouseStorage>
	onEdit: () => void
	onDelete: () => void
}

const StorageRowActions: React.FC<WarehouseRowActionsProps> = (props) => {
	const { t } = useTranslation()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className='border-none ring-0 outline-none focus-within:outline-none' role='button'>
				<DotsHorizontalIcon />
				<span className='sr-only'>Open menu</span>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='min-w-40'>
				<RoleBaseAccessControl
					mode='fallback'
					authorizedRoles={[UserRole.ADMIN, UserRole.MANAGER]}
					fallbackComponent={
						<DropdownMenuItem className='flex items-center gap-x-3' disabled>
							<Icon name='Lock' />
							{t('ns_common:actions.update')}
						</DropdownMenuItem>
					}>
					<DropdownMenuItem
						className='flex items-center gap-x-3'
						onClick={() => {
							if (props.onEdit && typeof props.onEdit === 'function') props.onEdit()
						}}>
						<Icon name='Pencil' />
						{t('ns_common:actions.update')}
					</DropdownMenuItem>
				</RoleBaseAccessControl>
				<RoleBaseAccessControl
					mode='fallback'
					authorizedRoles={[UserRole.ADMIN, UserRole.MANAGER]}
					fallbackComponent={
						<DropdownMenuItem className='flex items-center gap-x-3' disabled>
							<Icon name='Lock' />
							{t('ns_common:actions.delete')}
						</DropdownMenuItem>
					}>
					<DropdownMenuItem
						className='flex items-center gap-x-3'
						onClick={() => {
							if (props.onDelete && typeof props.onDelete === 'function') props.onDelete()
						}}>
						<Icon name='Trash2' />
						{t('ns_common:actions.delete')}
					</DropdownMenuItem>
				</RoleBaseAccessControl>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default StorageRowActions
