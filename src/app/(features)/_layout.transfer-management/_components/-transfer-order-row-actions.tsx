import { Fragment } from 'react'
import { CellContext } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { ITransferOrder } from '@/common/types/entities'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
	Icon,
	Typography
} from '@/components/ui'
import { UpdateApprovalStatusValues, UpdateTransferOrderValues } from '../_schemas/-transfer-order.schema'
import { CommonActions, OrderStatus } from '@/common/constants/enums'
import { omit, pick } from 'lodash'
import { useAuth } from '@/common/hooks/use-auth'
import { usePageStore } from '../_stores/-page-store'

type TransferOrderRowActionsProps = {
	cellContext: CellContext<ITransferOrder, unknown>
	onSaveChange: (dataChanges: UpdateTransferOrderValues | UpdateApprovalStatusValues) => Promise<any>
	onDeleteRow: () => void
	onViewDetail: () => void
}

const TransferOrderRowActions: React.FC<TransferOrderRowActionsProps> = ({
	cellContext: { table, row },
	onSaveChange,
	onDeleteRow
}) => {
	const { t } = useTranslation()
	const meta = table.options.meta
	const { user } = useAuth()
	const { toggleSheetPanelFormOpen, setCurrentOrder } = usePageStore()

	const setEditedRows = async (e: React.MouseEvent<HTMLButtonElement>) => {
		const action = e.currentTarget.dataset.action
		meta?.setEditedRows((old) => ({
			...old,
			[row.id]: !old[row.id]
		}))
		if (action === CommonActions.CANCEL) {
			meta?.revertDataChanges(row.index)
			return
		}
		if (action === CommonActions.SAVE) {
			meta?.setEditedRows((old) => omit(old, row.id))
			await onSaveChange({
				or_warehouse: row.original.or_warehouse_num,
				or_location: row.original.or_storage_num,
				new_warehouse: row.original.new_warehouse_num,
				new_location: row.original.new_storage_num
			})
		}
	}

	const handleSetApprovalStatus = async (status: OrderStatus) =>
		await onSaveChange({
			status_approve: status,
			employee_name_approve: user.display_name,
			approve_date: new Date()
		})

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				role='button'
				className='size-4 focus-within:outline-none focus-within:ring-0 focus-within:ring-offset-0 focus-within:ring-offset-transparent'>
				<Icon name='Ellipsis' />
				<Typography className='sr-only'>Open menu</Typography>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='min-w-60'>
				{meta?.editedRows[row.id] ? (
					<Fragment>
						<DropdownMenuItem asChild>
							<DropdownMenuButton data-action={CommonActions.CANCEL} onClick={setEditedRows}>
								<Icon name='X' stroke='hsl(var(--destructive))' />
								<Typography variant='small' className='text-destructive group-hover:text-destructive'>
									{t('ns_common:actions.cancel')}
								</Typography>
							</DropdownMenuButton>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<DropdownMenuButton
								data-action={CommonActions.SAVE}
								onClick={(e) => {
									setEditedRows(e)
								}}>
								<Icon name='Save' />
								{t('ns_common:actions.save')}
							</DropdownMenuButton>
						</DropdownMenuItem>
					</Fragment>
				) : (
					<DropdownMenuItem asChild>
						<DropdownMenuButton onClick={setEditedRows} data-action={CommonActions.UPDATE}>
							<Icon name='Pencil' />
							{t('ns_common:actions.update')}
						</DropdownMenuButton>
					</DropdownMenuItem>
				)}

				<DropdownMenuItem
					className='flex items-center gap-x-3'
					onClick={() => {
						toggleSheetPanelFormOpen()
						setCurrentOrder(pick(row.original, ['transfer_order_code', 'or_no']))
					}}>
					<Icon name='SquareDashedMousePointer' />
					{t('ns_common:actions.detail')}
				</DropdownMenuItem>

				<DropdownMenuSub>
					<DropdownMenuSubTrigger>
						<Icon name='TicketCheck' className='mr-2 h-4 w-4' />
						<Typography variant='small'>Set approval status</Typography>
					</DropdownMenuSubTrigger>
					<DropdownMenuPortal>
						<DropdownMenuSubContent>
							{row.original.status_approve === OrderStatus.NOT_APPROVED ? (
								<DropdownMenuItem
									className='text-sm'
									onClick={() => handleSetApprovalStatus(OrderStatus.APPROVED)}>
									<Icon name='CheckCheck' className='mr-2 h-4 w-4' />
									{t('ns_common:actions.approve')}
								</DropdownMenuItem>
							) : (
								<Fragment>
									<DropdownMenuItem onClick={() => handleSetApprovalStatus(OrderStatus.REAPPROVED)}>
										<Icon name='Redo2' className='mr-2 h-4 w-4' />
										<Typography variant='small'>{t('ns_common:actions.reapprove')}</Typography>
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => handleSetApprovalStatus(OrderStatus.CANCELLED)}>
										<Icon name='X' className='mr-2 h-4 w-4' stroke='hsl(var(--destructive))' />
										<Typography variant='small' color='destructive'>
											{t('ns_common:actions.cancel_approve')}
										</Typography>
									</DropdownMenuItem>
								</Fragment>
							)}
						</DropdownMenuSubContent>
					</DropdownMenuPortal>
				</DropdownMenuSub>

				<DropdownMenuItem
					className='flex items-center gap-x-3'
					onClick={() => {
						if (typeof onDeleteRow === 'function') onDeleteRow()
					}}>
					<Icon name='Trash2' />
					{t('ns_common:actions.delete')}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

const DropdownMenuButton = tw.button`gap-x-3 relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground w-full`

export default TransferOrderRowActions
