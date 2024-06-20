import { IWarehouse } from '@/common/types/entities'
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Icon } from '@/components/ui'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Link } from '@tanstack/react-router'
import { Row } from '@tanstack/react-table'
import React from 'react'
import { useTranslation } from 'react-i18next'

type WarehouseRowActionsProps = {
	row: Row<IWarehouse>
	enableEditing: boolean
	enableDeleting: boolean
	onEdit: () => void
	onDelete: () => void
}

const WarehouseRowActions: React.FC<WarehouseRowActionsProps> = (props) => {
	const { t } = useTranslation()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant='ghost' size='icon' className='!border-none !outline-none !ring-0'>
					<DotsHorizontalIcon />
					<span className='sr-only'>Open menu</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='min-w-40'>
				<DropdownMenuItem asChild className='flex items-center gap-x-3'>
					<Link
						to={`/warehouse/storage-details/$warehouseNum`}
						params={{ warehouseNum: props.row.original?.warehouse_num }}>
						<Icon name='SquareDashedMousePointer' />
						{t('ns_common:actions.detail')}
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem
					disabled={!props.enableEditing}
					className='flex items-center gap-x-3'
					onClick={() => {
						if (props.onEdit && typeof props.onEdit === 'function') props.onEdit()
					}}>
					<Icon name='Pencil' />
					{t('ns_common:actions.update')}
				</DropdownMenuItem>

				<DropdownMenuItem
					disabled={!props.enableDeleting}
					className='flex items-center gap-x-3'
					onClick={() => {
						if (props.onDelete && typeof props.onDelete === 'function') props.onDelete()
					}}>
					<Icon name='Trash2' />
					{t('ns_common:actions.delete')}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

export default WarehouseRowActions
