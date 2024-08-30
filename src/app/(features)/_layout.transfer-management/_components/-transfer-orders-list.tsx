/* eslint-disable react-hooks/rules-of-hooks */
import { ITransferOrder } from '@/common/types/entities'
import { Button, DataTable, Div, Icon, Separator, Tooltip, Typography } from '@/components/ui'
import ConfirmDialog from '@/components/ui/@override/confirm-dialog'
import { type Table } from '@tanstack/react-table'
import { isEmpty } from 'lodash'
import { Fragment, useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
	useDeleteTransferOrderMutation,
	useGetTransferOrderQuery,
	useUpdateMultiTransferOrderMutation
} from '../_apis/-use-transfer-order-api'
import { useTransferOrderTableColumns } from '../_hooks/use-columns.hook'
import { usePageStore } from '../_stores/page.store'

const TransferOrdersList: React.FC = () => {
	const tableRef = useRef<Table<any>>(null)
	const { t } = useTranslation()
	const { toggleDatalistDialogOpen } = usePageStore()
	const [rowSelectionType, setRowSelectionType] = useState<RowDeletionType>(undefined)
	const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false)

	const { data, isLoading, refetch } = useGetTransferOrderQuery()

	const { mutateAsync: deleteAsync } = useDeleteTransferOrderMutation()
	const { mutateAsync: updateMultiAsync } = useUpdateMultiTransferOrderMutation()

	const columns = useTransferOrderTableColumns({
		setConfirmDialogOpen,
		setRowSelectionType
	})

	//
	const handleResetAllRowSelection = useCallback(() => {
		tableRef.current.resetRowSelection()
		setRowSelectionType(undefined)
	}, [tableRef])

	// Handle delete selected row(s)
	const handleDeleteSelectedRows = useCallback(() => {
		deleteAsync(tableRef.current.getSelectedRowModel().flatRows.map((item) => item.original.transfer_order_code))
		handleResetAllRowSelection()
	}, [tableRef])

	return (
		<Fragment>
			<Div className='space-y-6'>
				<Div className='flex justify-between'>
					<Div className='space-y-1'>
						<Typography variant='h6' className='font-bold'>
							{t('ns_inoutbound:titles.transfer_order_list')}
						</Typography>
						<Typography variant='small' color='muted'>
							{t('ns_inoutbound:description.transfer_order_list')}
						</Typography>
					</Div>
					<Button onClick={() => toggleDatalistDialogOpen()}>
						<Icon name='CirclePlus' role='img' aria-label={t('ns_common:actions.add')} />{' '}
						{t('ns_common:actions.add')}
					</Button>
				</Div>
				<Separator />
				<DataTable
					ref={tableRef}
					data={data}
					loading={isLoading}
					columns={columns}
					enableColumnFilters={true}
					enableColumnResizing={true}
					enableGrouping={true}
					enableRowSelection={true}
					toolbarProps={{
						slotLeft: ({ table }) => {
							const { editedRows } = table.options.meta
							const disabled = Object.values(editedRows).every((value) => value === false) || isEmpty(editedRows)

							return (
								<Div className='flex items-center gap-x-1'>
									<Button
										size='sm'
										variant='secondary'
										disabled={disabled}
										onClick={() => {
											table.options.meta.setEditedRows({})
											updateMultiAsync(
												table.options.meta.getUnsavedChanges().map((item: ITransferOrder) => ({
													transfer_order_code: item.transfer_order_code,
													or_warehouse: item.or_warehouse_num,
													or_location: item.or_storage_num,
													new_warehouse: item.new_warehouse_num,
													new_location: item.new_storage_num
												}))
											)
										}}>
										<Icon name='SaveAll' role='img' />
										{t('ns_common:actions.save')}
									</Button>
									<Button
										size='sm'
										variant='outline'
										disabled={disabled}
										onClick={() => table.options.meta.discardChanges()}>
										<Icon name='Undo' role='img' />
										{t('ns_common:actions.revert_changes')}
									</Button>
								</Div>
							)
						},
						slotRight: () => (
							<Fragment>
								{tableRef.current &&
									tableRef.current?.getSelectedRowModel().flatRows.length > 0 &&
									rowSelectionType === 'multiple' && (
										<Tooltip triggerProps={{ asChild: true }} message={t('ns_common:actions.add')}>
											<Button
												variant='destructive'
												size='icon'
												onClick={() => setConfirmDialogOpen(!confirmDialogOpen)}>
												<Icon name='Trash2' />
											</Button>
										</Tooltip>
									)}
								<Fragment>
									<Tooltip message={t('ns_common:actions.reload')} triggerProps={{ asChild: true }}>
										<Button variant='outline' size='icon' onClick={() => refetch()}>
											<Icon name='RotateCw' />
										</Button>
									</Tooltip>
								</Fragment>
							</Fragment>
						)
					}}
				/>
			</Div>

			<ConfirmDialog
				open={confirmDialogOpen}
				onOpenChange={setConfirmDialogOpen}
				title={t('ns_common:confirmation.delete_title')}
				description={t('ns_common:confirmation.delete_description')}
				onConfirm={handleDeleteSelectedRows}
				onCancel={handleResetAllRowSelection}
			/>
		</Fragment>
	)
}

export default TransferOrdersList
