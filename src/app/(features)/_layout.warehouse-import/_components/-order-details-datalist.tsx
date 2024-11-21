import { Button, Checkbox, DataTable, Div, Icon, Tooltip, Typography } from '@/components/ui'
import ConfirmDialog from '@/components/ui/@override/confirm-dialog'
import { ROW_ACTIONS_COLUMN_ID, ROW_SELECTION_COLUMN_ID } from '@/components/ui/@react-table/constants'
import { fuzzySort } from '@/components/ui/@react-table/utils/fuzzy-sort.util'
import { CheckedState } from '@radix-ui/react-checkbox'
import { Table, createColumnHelper } from '@tanstack/react-table'
import { format, isValid } from 'date-fns'
import { isEmpty } from 'lodash'
import React, { Fragment, useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TransferOrderApprovalStatus } from '../../_layout.transfer-management/_constants/-transfer-order.enum'
import { usePageStore } from '../../_layout.transfer-management/_stores/page.store'
import { useDeleteImportOrderMutation, useGetProductionImportListQuery } from '../_apis/use-warehouse-import.api'
import ImportOrderRowActions from './-import-order-row-actions'

const ProductionImportList: React.FC = () => {
	const { t, i18n } = useTranslation()
	const { data, isLoading, refetch } = useGetProductionImportListQuery()
	const columnHelper = createColumnHelper()
	const [rowSelectionType, setRowSelectionType] = useState<RowDeletionType>(undefined)
	const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false)
	const { toggleSheetPanelFormOpen: handleToggleFormOpen } = usePageStore()

	console.log('toggleSheetPanelFormOpen exists:', !!handleToggleFormOpen)
	// const { mutateAsync: updateAsync } = useUpdateTransferOrderMutation()
	const tableRef = useRef<Table<any>>(null)
	const { mutateAsync: deleteAsync } = useDeleteImportOrderMutation()

	const handleResetAllRowSelection = useCallback(() => {
		tableRef.current.resetRowSelection()
		setRowSelectionType(undefined)
	}, [tableRef])

	const handleDeleteSelectedRows = useCallback(() => {
		deleteAsync(tableRef?.current?.getSelectedRowModel()?.flatRows?.map((item) => item.original.sno_no))
		handleResetAllRowSelection()
	}, [tableRef])

	const columns = useMemo(
		() => [
			columnHelper.display({
				id: ROW_SELECTION_COLUMN_ID,
				header: ({ table }) => {
					const checked =
						table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
					return (
						<Checkbox
							role='checkbox'
							checked={checked as CheckedState}
							onCheckedChange={(checkedState) => {
								setRowSelectionType('multiple')
								table.toggleAllPageRowsSelected(!!checkedState)
							}}
						/>
					)
				},
				cell: ({ row }) => (
					<Checkbox
						aria-label='Select row'
						role='checkbox'
						checked={row.getIsSelected()}
						onCheckedChange={(checkedState) => {
							if (checkedState) setRowSelectionType('multiple')
							row.toggleSelected(Boolean(checkedState))
						}}
					/>
				),
				size: 50,
				enableSorting: false,
				enableHiding: false,
				enableResizing: false,
				enablePinning: false
			}),
			columnHelper.accessor('sno_no', {
				id: 'sno_no',
				header: t('ns_erp:fields.sno_no'),
				enableSorting: true,
				enableColumnFilter: true,
				enablePinning: true,
				sortingFn: fuzzySort
			}),
			columnHelper.accessor('status_approve', {
				header: t('ns_erp:fields.status_approve'),
				cell: ({ getValue }) => {
					const value = getValue() ?? TransferOrderApprovalStatus.NOT_APPROVED
					const statusIconMap: Record<TransferOrderApprovalStatus, React.ComponentProps<typeof Icon>['name']> = {
						[TransferOrderApprovalStatus.NOT_APPROVED]: 'Circle',
						[TransferOrderApprovalStatus.APPROVED]: 'CircleCheck',
						[TransferOrderApprovalStatus.CANCELLED]: 'CircleX',
						[TransferOrderApprovalStatus.REAPPROVED]: 'CircleDot'
					}
					return (
						<Typography variant='small' className='inline-flex items-center gap-x-2'>
							<Icon name={statusIconMap[value]} stroke='hsl(var(--muted-foreground))' />
							{t(`order_status.${value}`, {
								ns: 'ns_inoutbound',
								defaultValue: value as any
							})}
						</Typography>
					)
				}
			}),
			columnHelper.accessor('sno_date', {
				id: 'sno_date',
				header: t('ns_erp:fields.sno_date'),
				cell: ({ getValue }) => format(getValue() as Date, 'yyyy/MM/dd'),
				meta: { filterVariant: 'date' },
				filterFn: 'inDateRange',
				enableSorting: true,
				enableColumnFilter: true,
				enablePinning: true,
				sortingFn: fuzzySort
			}),
			columnHelper.accessor('dept_code', {
				id: 'dept_code',
				header: t('ns_erp:fields.shaping_dept_code'),
				enableSorting: true,
				enableColumnFilter: true,
				enablePinning: true,
				sortingFn: fuzzySort
			}),
			columnHelper.accessor('dept_name', {
				id: 'dept_name',
				header: t('ns_erp:fields.shaping_dept_name'),
				enableSorting: true,
				enableColumnFilter: true,
				enablePinning: true,
				sortingFn: fuzzySort
			}),
			columnHelper.accessor('sno_location', {
				id: 'sno_location',
				header: t('ns_warehouse:fields.storage_num'),
				enableSorting: true,
				enableColumnFilter: true,
				enablePinning: true,
				sortingFn: fuzzySort
			}),
			columnHelper.accessor('user_name_updated', {
				id: 'user_name_updated',
				header: t('ns_common:common_fields.user_name_updated'),
				enableSorting: true,
				enableColumnFilter: true,
				enablePinning: true,
				sortingFn: fuzzySort
			}),
			columnHelper.accessor('updated', {
				id: 'updated',
				header: t('ns_common:common_fields.updated_at'),
				enableSorting: true,
				enableColumnFilter: true,
				enablePinning: true,
				sortingFn: fuzzySort,
				cell: ({ getValue }) => {
					const value = getValue()
					if (!value || isValid(value)) return '-'
					return format(value as Date, 'yyyy-MM-dd')
				}
			}),

			columnHelper.accessor('id', {
				id: ROW_ACTIONS_COLUMN_ID,
				header: t('ns_common:common_fields.actions'),
				// meta: {
				// 	rowSpan: 2
				// },
				size: 80,
				cell: (props) => (
					<ImportOrderRowActions
						cellContext={props}
						onViewDetail={() => {
							console.log('onViewDetail clicked')
							handleToggleFormOpen()
						}}
						onDeleteRow={() => {
							console.log('Delete triggered')
						}}
						onSaveChange={async (dataChanges) => {
							console.log('Save triggered with:', dataChanges)
						}}
					/>
				)
			})
		],
		[i18n.language]
	)

	return (
		<Fragment>
			<DataTable
				data={data}
				ref={tableRef}
				loading={isLoading}
				columns={columns}
				enableRowSelection={true}
				enableColumnFilters={true}
				enableColumnResizing={true}
				enableGrouping={true}
				containerProps={{ className: 'h-[50vh] xxl:h-[60vh]' }}
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
										const unsavedChanges = table.options.meta.getUnsavedChanges()

										table.options.meta.setEditedRows({})
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
			<ConfirmDialog
				open={confirmDialogOpen}
				onOpenChange={setConfirmDialogOpen}
				title={t('ns_common:confirmation.delete_title')}
				description={t('ns_common:confirmation.delete_description')}
				onConfirm={() => {
					handleDeleteSelectedRows()
				}}
				onCancel={() => {
					handleResetAllRowSelection()
				}}
			/>
		</Fragment>
	)
}

export default ProductionImportList
