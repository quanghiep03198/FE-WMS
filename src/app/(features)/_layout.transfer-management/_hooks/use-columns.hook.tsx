/* eslint-disable react-hooks/rules-of-hooks */
import { ITransferOrder, IWarehouse } from '@/common/types/entities'
import { Checkbox, Icon, Typography } from '@/components/ui'
import { fuzzySort } from '@/components/ui/@react-table/utils/fuzzy-sort.util'
import { CheckedState } from '@radix-ui/react-checkbox'
import { createColumnHelper } from '@tanstack/react-table'
import { useUpdate } from 'ahooks'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetWarehouseQuery } from '../../_layout.warehouse/_apis/warehouse.api'

import { ROW_ACTIONS_COLUMN_ID, ROW_SELECTION_COLUMN_ID } from '@/common/constants/constants'
import { useUpdateTransferOrderMutation } from '../_apis/-use-transfer-order-api'
import { StorageCellEditor, WarehouseCellEditor } from '../_components/-cell-editor'
import TransferOrderRowActions from '../_components/-transfer-order-row-actions'
import { TransferOrderApprovalStatus } from '../_constants/-transfer-order.enum'
import { UpdateTransferOrderValues } from '../_schemas/transfer-order.schema'
import { usePageStore } from '../_stores/page.store'

type TransferOrderTableColumnParams = {
	setConfirmDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
	setRowSelectionType: React.Dispatch<React.SetStateAction<RowDeletionType>>
}

export const useTransferOrderTableColumns = ({
	setRowSelectionType,
	setConfirmDialogOpen
}: TransferOrderTableColumnParams) => {
	const update = useUpdate() // Force re-render to sync table state
	const { t, i18n } = useTranslation()
	const { toggleSheetPanelFormOpen } = usePageStore()
	const { mutateAsync: updateAsync } = useUpdateTransferOrderMutation()

	const { data: warehouseLists } = useGetWarehouseQuery<IWarehouse[]>({
		select: (response) => (Array.isArray(response.metadata) ? response.metadata : [])
	})

	const columnHelper = createColumnHelper<ITransferOrder>()

	return useMemo(
		() => [
			columnHelper.accessor('id', {
				id: ROW_SELECTION_COLUMN_ID,
				header: ({ table }) => {
					const checked =
						table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')

					return (
						<Checkbox
							role='checkbox'
							checked={checked as CheckedState}
							onCheckedChange={(checkedState) => {
								if (checkedState) setRowSelectionType('multiple')
								table.toggleAllRowsSelected(!!checkedState)
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
				meta: { sticky: 'left', rowSpan: 2 },
				size: 50,
				enableSorting: false,
				enableHiding: false,
				enableColumnFilter: false,
				enableResizing: false
			}),

			columnHelper.group({
				id: 'order-information',
				header: t('ns_inoutbound:labels.order_information'),
				enableResizing: true,
				columns: [
					columnHelper.accessor('brand_name', {
						header: t('ns_erp:fields.brand_name'),
						minSize: 200,
						enableColumnFilter: true,
						enableSorting: true,
						filterFn: 'fuzzy',
						sortingFn: fuzzySort
					}),
					columnHelper.accessor('transfer_order_code', {
						header: t('ns_inoutbound:fields.transfer_order_code'),
						cell: ({ getValue }) => {
							const value = getValue()
							return value ? String(value).toUpperCase() : '-'
						},
						minSize: 200,
						enableColumnFilter: true,
						enableSorting: true,
						filterFn: 'fuzzy',
						sortingFn: fuzzySort
					}),
					columnHelper.accessor('kg_no', {
						header: t('ns_inoutbound:fields.packaging_code'),
						cell: ({ getValue }) => {
							const value = getValue()
							return value ? String(value).toUpperCase() : '-'
						},
						minSize: 200,
						enableColumnFilter: true,
						enableSorting: true,
						filterFn: 'fuzzy',
						sortingFn: fuzzySort
					}),
					columnHelper.accessor('mo_no', {
						header: t('ns_inoutbound:fields.mo_no'),
						cell: ({ getValue }) => {
							const value = getValue()
							return value ? String(value).toUpperCase() : '-'
						},
						minSize: 200,
						enableColumnFilter: true,
						enableSorting: true,
						filterFn: 'fuzzy',
						sortingFn: fuzzySort
					}),
					columnHelper.accessor('or_no', {
						header: t('ns_inoutbound:fields.or_no'),
						cell: ({ getValue }) => {
							const value = getValue()
							return value ? String(value).toUpperCase() : '-'
						},
						minSize: 250,
						enableColumnFilter: true,
						enableSorting: true,
						filterFn: 'fuzzy',
						sortingFn: fuzzySort
					}),
					columnHelper.accessor('or_custpo', {
						header: t('ns_inoutbound:fields.or_custpo'),
						cell: ({ getValue }) => {
							const value = getValue()
							return value ? String(value).toUpperCase() : '-'
						},
						minSize: 250,
						enableColumnFilter: true,
						enableSorting: true,
						filterFn: 'fuzzy',
						sortingFn: fuzzySort
					}),
					columnHelper.accessor('shoestyle_codefactory', {
						header: t('ns_erp:fields.shoes_style_code_factory'),
						cell: ({ getValue }) => {
							const value = getValue()
							return value ? String(value).toUpperCase() : '-'
						},
						minSize: 250,
						enableColumnFilter: true,
						enableSorting: true,
						filterFn: 'fuzzy',
						sortingFn: fuzzySort
					})
				]
			}),

			columnHelper.group({
				id: 'tranfer-information',
				header: t('ns_inoutbound:labels.transfer_information'),
				enableResizing: false,
				columns: [
					columnHelper.accessor('or_warehouse_num', {
						header: t('ns_warehouse:fields.original_warehouse'),
						minSize: 250,
						cell: (props) => (
							<WarehouseCellEditor {...{ ...props, transformedValue: props.row.original.or_warehouse_name }} />
						)
					}),
					columnHelper.accessor('or_storage_num', {
						header: t('ns_warehouse:fields.original_storage_location'),
						minSize: 250,
						cell: (props) => {
							const rowData = props.row.original

							return (
								<StorageCellEditor
									{...{
										...props,
										selectedWarehouse: rowData.or_warehouse_num,
										transformedValue: rowData.or_storage_name
									}}
								/>
							)
						}
					}),
					columnHelper.accessor('new_warehouse_num', {
						header: t('ns_warehouse:fields.new_warehouse'),
						minSize: 250,
						cell: (props) => (
							<WarehouseCellEditor {...{ ...props, transformedValue: props.row.original.new_warehouse_name }} />
						)
					}),
					columnHelper.accessor('new_storage_num', {
						header: t('ns_warehouse:fields.new_storage_location'),
						minSize: 250,
						cell: (props) => {
							const rowData = props.row.original

							return (
								<StorageCellEditor
									{...{
										...props,
										selectedWarehouse: rowData.new_warehouse_num,
										transformedValue: rowData.new_storage_name
									}}
								/>
							)
						}
					}),
					columnHelper.accessor('status_approve', {
						header: t('ns_inoutbound:fields.status_approve'),
						cell: ({ getValue }) => {
							const value = getValue() ?? TransferOrderApprovalStatus.NOT_APPROVED
							const statusIconMap: Record<
								TransferOrderApprovalStatus,
								React.ComponentProps<typeof Icon>['name']
							> = {
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
										defaultValue: value
									})}
								</Typography>
							)
						}
					}),
					columnHelper.accessor('employee_name_approve', {
						header: t('ns_common:common_fields.approver')
					}),
					columnHelper.accessor('approve_date', {
						header: t('ns_common:common_fields.approver_time')
					})
				]
			}),

			columnHelper.display({
				id: ROW_ACTIONS_COLUMN_ID,
				header: t('ns_common:common_fields.actions'),
				meta: {
					sticky: 'right',
					rowSpan: 2
				},
				size: 100,
				cell: (props) => (
					<TransferOrderRowActions
						cellContext={props}
						onViewDetail={() => toggleSheetPanelFormOpen}
						onSaveChange={(data: UpdateTransferOrderValues) =>
							updateAsync({ transferOrderCode: props.row.original.transfer_order_code, payload: data })
						}
						onDeleteRow={() => {
							setConfirmDialogOpen((prev) => !prev)
							setRowSelectionType('single')
							props.row.toggleSelected(true)
						}}
					/>
				)
			})
		],
		[i18n.language, warehouseLists]
	)
}
