import { IWarehouseStorage } from '@/common/types/entities'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Icon } from '@/components/ui'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
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
			<DropdownMenuTrigger className='border-none outline-none ring-0 focus-within:outline-none' role='button'>
				<DotsHorizontalIcon />
				<span className='sr-only'>Open menu</span>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='min-w-40'>
				<DropdownMenuItem
					className='flex items-center gap-x-3'
					onClick={() => {
						if (props.onEdit && typeof props.onEdit === 'function') props.onEdit()
					}}>
					<Icon name='Pencil' />
					{t('ns_common:actions.update')}
				</DropdownMenuItem>

				<DropdownMenuItem
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

export default StorageRowActions
