// #region Modules
import { CommonActions } from '@/common/constants/enums'
import type { IWarehouseStorage } from '@/common/types/entities'
import { Button, Checkbox, DataTable, Icon, Tooltip, Typography } from '@/components/ui'
import ConfirmDialog from '@/components/ui/@override/confirm-dialog'
import {
	IndeterminateCheckbox,
	RowSelectionCheckbox
} from '@/components/ui/@react-table/components/row-selection-checkbox'
import { ROW_ACTIONS_COLUMN_ID, ROW_SELECTION_COLUMN_ID } from '@/components/ui/@react-table/constants'
import { fuzzySort } from '@/components/ui/@react-table/utils/fuzzy-sort.util'
import type { UseQueryResult } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import type { Table } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'
import { useResetState } from 'ahooks'
import { format } from 'date-fns'
import { Fragment, memo, useMemo, useRef, useState } from 'react'
import isEqual from 'react-fast-compare'
import { useTranslation } from 'react-i18next'
import { warehouseStorageTypes } from '../../-constants/warehouse.const'
import { usePageContext } from '../../-contexts/page-context'
import { useDeleteStorageMutation, useUpdateStorageMutation } from '../../-hooks/use-warehouse-storage-asm'
import StorageRowActions from './storage-row-actions'
// #endregion

const StorageList: React.FC<UseQueryResult<IWarehouseStorage[]>> = ({ data, isLoading, refetch }) => {
	const { t, i18n } = useTranslation(['ns_common'])
	const tableRef = useRef<Table<any>>(null)
	const [rowSelectionType, setRowSelectionType, resetRowSelectionType] = useResetState<RowDeletionType>(undefined)
	const { warehouseNum } = useParams({ strict: false })
	const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false)

	const { dispatch } = usePageContext()

	// Update warehouse storage location
	const { mutateAsync: updateWarehouseStorage } = useUpdateStorageMutation({ warehouseNum })

	const handleResetAllRowSelection = () => {
		tableRef.current.resetRowSelection()
		resetRowSelectionType()
	}

	const handleDeleteSelectedRows = () => {
		deleteWarehouseStorage(tableRef.current.getSelectedRowModel().flatRows.map((item) => item.original?.id))
	}

	// Delete selected warehouse storage locations
	const { mutateAsync: deleteWarehouseStorage } = useDeleteStorageMutation(
		{ warehouseNum },
		{ onSettled: handleResetAllRowSelection }
	)

	const columnHelper = createColumnHelper<IWarehouseStorage>()

	const columns = useMemo(
		() => [
			columnHelper.accessor('id', {
				id: ROW_SELECTION_COLUMN_ID,
				header: (props) => (
					<IndeterminateCheckbox
						{...props}
						onCheckedChange={(checked) => {
							if (checked) setRowSelectionType('multiple')
						}}
					/>
				),
				cell: (props) => (
					<RowSelectionCheckbox
						{...props}
						onCheckedChange={(checked) => {
							if (checked) setRowSelectionType('multiple')
						}}
					/>
				),
				size: 50,
				maxSize: 50,
				enableSorting: false,
				enableHiding: false,
				enableResizing: false
			}),
			columnHelper.accessor('storage_num', {
				header: t('ns_warehouse:fields.storage_num'),
				enableSorting: true,
				enableColumnFilter: true,
				enableHiding: false,
				filterFn: 'fuzzy',
				sortingFn: fuzzySort
			}),
			columnHelper.accessor('storage_name', {
				header: t('ns_warehouse:fields.storage_name'),
				enableSorting: true,
				enableColumnFilter: true,
				enableHiding: false,
				filterFn: 'fuzzy',
				sortingFn: fuzzySort
			}),
			columnHelper.accessor('type_storage', {
				header: t('ns_warehouse:fields.type_storage'),
				enableSorting: true,
				enableColumnFilter: true,
				enableHiding: false,
				meta: {
					filterVariant: 'select',
					facetedUniqueValues: Object.entries(warehouseStorageTypes).map(([key, val]) => ({
						label: t(val, { ns: 'ns_warehouse', defaultValue: val }),
						value: key
					}))
				},
				cell: ({ getValue }) => {
					const originalValue = getValue()
					return t(warehouseStorageTypes[originalValue], { ns: 'ns_warehouse' })
				}
			}),
			columnHelper.accessor('storage_capacity', {
				header: t('ns_warehouse:fields.storage_capacity'),
				enableSorting: true,
				enableColumnFilter: true,
				enableHiding: false,
				filterFn: 'inNumberRange',
				meta: {
					filterVariant: 'range'
				}
			}),
			columnHelper.accessor('warehouse_name', {
				header: t('ns_warehouse:fields.warehouse_name'),
				enableSorting: true,
				enableColumnFilter: true,
				enableHiding: false,
				filterFn: 'fuzzy',
				sortingFn: fuzzySort
			}),
			columnHelper.accessor('is_disable', {
				header: t('ns_warehouse:fields.is_disable'),
				size: 100,
				meta: { align: 'center' },
				cell: ({ getValue, row }) => {
					const value = getValue()
					const { original } = row
					return (
						<Checkbox
							role='checkbox'
							aria-disabled={value}
							checked={value}
							onCheckedChange={async (checked) =>
								await updateWarehouseStorage({
									id: original.id,
									payload: {
										is_disable: Boolean(checked),
										is_default: checked ? false : Boolean(original.is_default)
									}
								})
							}
						/>
					)
				}
			}),
			columnHelper.accessor('is_default', {
				header: t('ns_warehouse:fields.is_default'),
				minSize: 100,
				meta: { align: 'center' },
				cell: ({ getValue, row: { original } }) => {
					const value = Boolean(getValue())
					return (
						<Checkbox
							role='checkbox'
							disabled={original.is_disable}
							checked={value}
							onCheckedChange={async (checked) =>
								await updateWarehouseStorage({
									id: original.id,
									payload: {
										is_default: Boolean(checked)
									}
								})
							}
						/>
					)
				}
			}),
			columnHelper.accessor('created', {
				header: t('ns_common:common_fields.created_at'),
				enableSorting: true,
				sortingFn: fuzzySort,
				cell: ({ getValue }) => {
					const createdAt = getValue()
					return format(createdAt, 'yyyy-MM-dd')
				}
			}),
			columnHelper.accessor('remark', {
				header: t('ns_common:common_fields.remark'),
				cell: ({ getValue }) =>
					getValue() || (
						<Typography variant='small' color='muted'>
							-
						</Typography>
					)
			}),
			columnHelper.display({
				id: ROW_ACTIONS_COLUMN_ID,
				header: t('ns_common:common_fields.actions'),
				size: 100,
				maxSize: 100,
				cell: ({ row }) => {
					return (
						<StorageRowActions
							row={row}
							onDelete={() => {
								setConfirmDialogOpen(!confirmDialogOpen)
								row.toggleSelected(true)
								setRowSelectionType('single')
							}}
							onEdit={() => {
								dispatch({
									type: CommonActions.UPDATE,
									payload: {
										dialogTitle: t('ns_common:common_form_titles.update', {
											object: t('ns_warehouse:specialized_vocabs.storage_area')
										}),
										defaultFormValues: row.original
									}
								})
							}}
						/>
					)
				}
			})
		],
		[i18n.language]
	)

	return (
		<Fragment>
			<DataTable
				ref={tableRef}
				data={data}
				loading={isLoading}
				columns={columns}
				enableColumnResizing={true}
				enableColumnFilters={true}
				enableRowSelection={true}
				containerProps={{
					style: { height: 'calc(var(--outlet-wrapper-height) - 12.5rem)' }
				}}
				toolbarProps={{
					slotRight: ({ table }) => (
						<Fragment>
							<Tooltip triggerProps={{ asChild: true }} message={t('ns_common:actions.upload')}>
								<Button variant='outline' size='icon' onClick={() => refetch()}>
									<Icon name='Upload' />
								</Button>
							</Tooltip>
							{table.getSelectedRowModel().flatRows.length > 0 && rowSelectionType === 'multiple' && (
								<Tooltip triggerProps={{ asChild: true }} message={t('ns_common:actions.add')}>
									<Button
										variant='destructive'
										size='icon'
										onClick={() => setConfirmDialogOpen((prev) => !prev)}>
										<Icon name='Trash2' />
									</Button>
								</Tooltip>
							)}
							<Tooltip triggerProps={{ asChild: true }} message={t('ns_common:actions.reload')}>
								<Button variant='outline' size='icon' onClick={() => refetch()}>
									<Icon name='RefreshCcw' />
								</Button>
							</Tooltip>
						</Fragment>
					)
				}}
			/>
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

export default memo(
	StorageList,
	(prev, next) => isEqual(prev.data, next.data) && isEqual(prev.isLoading, next.isLoading)
)
