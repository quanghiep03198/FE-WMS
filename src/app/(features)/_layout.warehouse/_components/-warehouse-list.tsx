// #region Modules
import { CommonActions } from '@/common/constants/enums'
import { IWarehouse } from '@/common/types/entities'
import { Button, Checkbox, DataTable, Icon, Tooltip } from '@/components/ui'
import ConfirmDialog from '@/components/ui/@override/confirm-dialog'
import { ROW_ACTIONS_COLUMN_ID, ROW_SELECTION_COLUMN_ID } from '@/components/ui/@react-table/constants'
import { fuzzySort } from '@/components/ui/@react-table/utils/fuzzy-sort.util'
import { CheckedState } from '@radix-ui/react-checkbox'
import { Table, createColumnHelper } from '@tanstack/react-table'
import { useResetState } from 'ahooks'
import { Fragment, useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
	useDeleteWarehouseMutation,
	useGetWarehouseQuery,
	useUpdateWarehouseStatusMutation
} from '../_apis/warehouse.api'
import { warehouseTypes } from '../_constants/warehouse.const'
import { usePageContext } from '../_contexts/-page-context'
import WarehouseRowActions from './-warehouse-row-actions'
// #endregion

// #region React Component
const WarehouseList: React.FC = () => {
	const { t, i18n } = useTranslation()
	const [rowSelectionType, setRowSelectionType, resetRowSelectionType] = useResetState<RowDeletionType>(undefined)
	const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false)
	const tableRef = useRef<Table<IWarehouse>>(null)
	const { dispatch } = usePageContext()

	// Handle reset row deletion
	const handleResetAllRowSelection = useCallback(() => {
		tableRef.current.resetRowSelection()
		resetRowSelectionType()
	}, [])

	// Handle delete selected row(s)
	const handleDeleteSelectedRows = useCallback(() => {
		deleteWarehouseAsync(tableRef.current.getSelectedRowModel().flatRows.map((item) => item.original.id))
	}, [])

	// Transform warehouse response data
	const transformResponse = useCallback(
		(response: ResponseBody<IWarehouse[]>) => {
			const { metadata } = response
			return Array.isArray(metadata)
				? metadata.map((item) => ({
						...item,
						is_default: Boolean(item.is_default),
						is_disable: Boolean(item.is_disable),
						type_warehouse: t(warehouseTypes[item.type_warehouse], {
							ns: 'ns_warehouse',
							defaultValue: item.type_warehouse
						})
					}))
				: []
		},
		[i18n.language]
	)

	// Get warehouse data
	const { data, isLoading, refetch } = useGetWarehouseQuery<IWarehouse[]>({ select: transformResponse })

	// Delete warehouse
	const { mutateAsync: deleteWarehouseAsync } = useDeleteWarehouseMutation(handleResetAllRowSelection)

	// Update warehouse status
	const { mutateAsync: updateWarehouseStatus } = useUpdateWarehouseStatusMutation()

	const columnHelper = createColumnHelper<IWarehouse>()

	const columns = useMemo(
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
			columnHelper.accessor('warehouse_num', {
				id: 'warehouse_num',
				header: t('ns_warehouse:fields.warehouse_num'),
				minSize: 150,
				enableColumnFilter: true,
				enableResizing: true,
				enablePinning: true,
				enableSorting: true,
				filterFn: 'fuzzy',
				sortingFn: fuzzySort,
				cell: ({ getValue }) => String(getValue()).toUpperCase()
			}),
			columnHelper.accessor('type_warehouse', {
				id: 'type_warehouse',
				header: t('ns_warehouse:fields.type_warehouse'),
				minSize: 250,
				enablePinning: true,
				enableColumnFilter: true,
				filterFn: 'equals',
				meta: { filterVariant: 'select' }
			}),
			columnHelper.accessor('warehouse_name', {
				id: 'warehouse_name',
				header: t('ns_warehouse:fields.warehouse_name'),
				minSize: 250,
				enablePinning: true,
				enableResizing: true,
				enableColumnFilter: true,
				filterFn: 'fuzzy',
				sortingFn: fuzzySort,
				enableSorting: true,
				cell: ({ getValue }) => String(getValue()).toUpperCase()
			}),
			columnHelper.accessor('area', {
				id: 'area',
				header: t('ns_warehouse:fields.area'),
				minSize: 150,
				meta: { filterVariant: 'range', align: 'right' },
				filterFn: 'inNumberRange',
				enableColumnFilter: true,
				enableGlobalFilter: false,
				enableResizing: true,
				enableSorting: true,
				sortingFn: fuzzySort,
				cell: ({ getValue }) => new Intl.NumberFormat('en-US', { minimumSignificantDigits: 3 }).format(getValue())
			}),
			columnHelper.accessor('is_disable', {
				id: 'is_disable',
				header: t('ns_warehouse:fields.is_disable'),
				size: 100,
				cell: ({ getValue, row: { original } }) => {
					const value = getValue()
					return (
						<Checkbox
							role='checkbox'
							checked={value}
							onCheckedChange={(checked) =>
								updateWarehouseStatus({
									id: original.id,
									payload: {
										is_disable: Boolean(checked),
										is_default: checked ? false : original.is_default
									}
								})
							}
						/>
					)
				}
			}),
			columnHelper.accessor('is_default', {
				id: 'is_default',
				header: t('ns_warehouse:fields.is_default'),
				minSize: 100,
				cell: ({ getValue, row: { original } }) => {
					const value = Boolean(getValue())
					return (
						<Checkbox
							role='checkbox'
							disabled={original.is_disable}
							checked={value}
							onCheckedChange={(checked) =>
								updateWarehouseStatus({
									id: original.id,
									payload: { is_default: Boolean(checked) }
								})
							}
						/>
					)
				}
			}),
			columnHelper.accessor('remark', {
				id: 'remark',
				header: t('ns_common:common_fields.remark'),
				enableResizing: true,
				cell: ({ getValue }) => getValue() ?? '-'
			}),
			columnHelper.accessor('id', {
				id: ROW_ACTIONS_COLUMN_ID,
				header: t('ns_common:common_fields.actions'),
				maxSize: 100,
				enableResizing: false,
				enableHiding: false,
				enablePinning: false,
				meta: { align: 'center' },
				cell: ({ row }) => (
					<WarehouseRowActions
						row={row}
						onDelete={() => {
							setConfirmDialogOpen(!confirmDialogOpen)
							setRowSelectionType('single')
							row.toggleSelected(true)
						}}
						onEdit={() => {
							dispatch({
								type: CommonActions.UPDATE,
								payload: {
									dialogTitle: t('ns_warehouse:form.update_warehouse_title'),
									defaultFormValues: {
										...row.original,
										type_warehouse: Object.keys(warehouseTypes).find(
											(key) => t(warehouseTypes[key], { ns: 'ns_warehouse' }) === row.original.type_warehouse
										)
									}
								}
							})
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
				columns={columns}
				loading={isLoading}
				enableColumnResizing={true}
				enableRowSelection={true}
				containerProps={{ style: { height: (screen.height * 40) / 100 } }}
				ref={tableRef}
				toolbarProps={{
					slotRight: ({ table }) => (
						<Fragment>
							{table.getSelectedRowModel().flatRows.length > 0 && rowSelectionType == 'multiple' && (
								<Tooltip triggerProps={{ asChild: true }} message={t('ns_common:actions.add')}>
									<Button
										variant='destructive'
										size='icon'
										onClick={() => setConfirmDialogOpen(!confirmDialogOpen)}>
										<Icon name='Trash2' />
									</Button>
								</Tooltip>
							)}
							<Tooltip triggerProps={{ asChild: true }} message={t('ns_common:actions.reload')}>
								<Button variant='outline' size='icon' onClick={() => refetch()}>
									<Icon name='RotateCw' />
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

export default WarehouseList
