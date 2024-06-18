import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Icon } from '@/components/ui'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { useTranslation } from 'react-i18next'

type DataTableRowActionsProps = {
	enableDeleting?: boolean
	enableEditing?: boolean
	slot?: React.ReactNode
	onDelete?: AnonymousFunction
	onEdit?: AnonymousFunction
}

export const DataTableRowActions: React.FC<DataTableRowActionsProps> = (props) => {
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
				{props.slot}
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
