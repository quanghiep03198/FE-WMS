import { UserRole } from '@common/constants/enums'
import RoleBaseAccessControl from '@components/guards/role-base-access-control'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@components/ui/dropdown-menu'
import { Icon } from '@components/ui/icon'
import { getOneWarehouseQueryOptions } from '@features/warehouse/hooks/use-warehouse-request'
import type { IWarehouse } from '@features/warehouse/types'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import type { Row } from '@tanstack/react-table'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

type WarehouseRowActionsProps = {
	row: Row<IWarehouse>
	onEdit: () => void
	onDelete: () => void
}

const WarehouseRowActions: React.FC<WarehouseRowActionsProps> = ({ row, onEdit, onDelete }) => {
	const { t } = useTranslation()
	const queryClient = useQueryClient()
	const [open, setOpen] = useState(false)
	// Prefetch warehouse storage detail before navigating

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger>
				<DotsHorizontalIcon />
				<span className='sr-only'>Open menu</span>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='min-w-40'>
				<DropdownMenuItem asChild={true} className='flex items-center gap-x-3'>
					<Link
						params={{ warehouseId: row.original._id! }}
						to='/storage-locations/$warehouseId'
						onMouseEnter={() => queryClient.query(getOneWarehouseQueryOptions(row.original._id!))}>
						<Icon name='SquareDashedMousePointer' />
						{t('ns_common:actions.detail')}
					</Link>
				</DropdownMenuItem>
				<RoleBaseAccessControl
					authorizedRoles={[UserRole.ADMIN, UserRole.MANAGER]}
					mode='fallback'
					fallbackComponent={
						<DropdownMenuItem disabled className='flex items-center gap-x-3'>
							<Icon name='Lock' />
							{t('ns_common:actions.update')}
						</DropdownMenuItem>
					}>
					<DropdownMenuItem
						className='flex items-center gap-x-3'
						onClick={() => {
							if (typeof onEdit === 'function') onEdit()
						}}>
						<Icon name='Pencil' />
						{t('ns_common:actions.update')}
					</DropdownMenuItem>
				</RoleBaseAccessControl>
				<RoleBaseAccessControl
					authorizedRoles={[UserRole.ADMIN, UserRole.MANAGER]}
					mode='fallback'
					fallbackComponent={
						<DropdownMenuItem disabled className='flex items-center gap-x-3'>
							<Icon name='Lock' />
							{t('ns_common:actions.delete')}
						</DropdownMenuItem>
					}>
					<DropdownMenuItem
						className='flex items-center gap-x-3'
						onClick={() => {
							if (typeof onDelete === 'function') onDelete()
						}}>
						<Icon name='Trash2' />
						{t('ns_common:actions.delete')}
					</DropdownMenuItem>
				</RoleBaseAccessControl>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default WarehouseRowActions
