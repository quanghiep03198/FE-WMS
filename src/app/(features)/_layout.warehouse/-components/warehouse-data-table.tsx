// #region Modules
import { CommonActions } from '@/common/constants/enums'
import type { IWarehouse } from '@/common/types/entities'
import { Button, Checkbox, DataTable, Icon, Tooltip } from '@/components/ui'
import ConfirmDialog from '@/components/ui/@override/confirm-dialog'
import {
	IndeterminateCheckbox,
	RowSelectionCheckbox
} from '@/components/ui/@react-table/components/row-selection-checkbox'
import { ROW_ACTIONS_COLUMN_ID, ROW_SELECTION_COLUMN_ID } from '@/components/ui/@react-table/constants'
import { fuzzySort } from '@/components/ui/@react-table/utils/fuzzy-sort.util'
import type { Row, Table } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'
import { useResetState } from 'ahooks'
import { Fragment, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { warehouseTypes } from '../-constants/warehouse.const'
import { usePageContext } from '../-contexts/page-context'
import {
	useDeleteWarehouseMutation,
	useGetWarehouseQuery,
	useUpdateWarehouseStatusMutation
} from '../-hooks/use-warehouse-asm'
import WarehouseRowActions from './warehouse-row-actions'
// #endregion

// #region React Component
const WarehouseDataTable: React.FC = () => {
	const { t, i18n } = useTranslation()
	const [rowSelectionType, setRowSelectionType, resetRowSelectionType] = useResetState<RowDeletionType>(undefined)
	const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false)
	const tableRef = useRef<Table<IWarehouse>>(null)
	const { dispatch } = usePageContext()

	// Handle reset row deletion
	const handleResetAllRowSelection = () => {
		tableRef.current.resetRowSelection()
		resetRowSelectionType()
	}

	// Handle delete selected row(s)
	const handleDeleteSelectedRows = () => {
		deleteWarehouseAsync(tableRef.current.getSelectedRowModel().flatRows.map((item) => item.original.id))
	}

	const handlePreUpdate = (row: Row<IWarehouse>) => {
		dispatch({
			type: CommonActions.UPDATE,
			payload: {
				dialogTitle: t('ns_warehouse:form.update_warehouse_title'),
				defaultFormValues: row.original
			}
		})
	}

	const handlePreDelete = (row: Row<IWarehouse>) => {
		setConfirmDialogOpen(!confirmDialogOpen)
		setRowSelectionType('single')
		row.toggleSelected(true)
	}

	// Get warehouse data
	const { data, isLoading, refetch } = useGetWarehouseQuery<IWarehouse[]>({
		select: (response) => response.metadata
	})

	// Delete warehouse
	const { mutateAsync: deleteWarehouseAsync } = useDeleteWarehouseMutation(handleResetAllRowSelection)

	// Update warehouse status
	const { mutateAsync: updateWarehouseStatus } = useUpdateWarehouseStatusMutation()

	const columnHelper = createColumnHelper<IWarehouse>()

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
				enableResizing: false,
				enablePinning: false,
				enableGlobalFilter: false,
				enableColumnFilter: false
			}),
			columnHelper.accessor('warehouse_num', {
				id: 'warehouse_num',
				header: t('ns_warehouse:fields.warehouse_num'),
				enableColumnFilter: true,
				enableGlobalFilter: true,
				enableResizing: true,
				enableSorting: true,
				filterFn: 'fuzzy',
				sortingFn: fuzzySort,
				cell: ({ getValue }) => String(getValue()).toUpperCase()
			}),
			columnHelper.accessor('type_warehouse', {
				id: 'type_warehouse',
				header: t('ns_warehouse:fields.type_warehouse'),
				enableSorting: true,
				enableGlobalFilter: false,
				enableColumnFilter: true,
				enableResizing: true,
				filterFn: 'equals',
				meta: {
					filterVariant: 'select',
					facetedUniqueValues: Object.entries(warehouseTypes).map(([key, val]) => ({
						label: t(val, { ns: 'ns_warehouse', defaultValue: val }),
						value: key
					}))
				},
				cell: ({ getValue }) => {
					const originalValue = getValue()
					return t(warehouseTypes[originalValue], {
						ns: 'ns_warehouse',
						defaultValue: originalValue
					})
				}
			}),
			columnHelper.accessor('warehouse_name', {
				id: 'warehouse_name',
				header: t('ns_warehouse:fields.warehouse_name'),
				minSize: 250,
				enableMultiSort: true,
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
				meta: { align: 'center' },
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
				meta: { align: 'center' },
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
				size: 100,
				maxSize: 100,
				enableResizing: false,
				enableHiding: false,
				enablePinning: false,
				meta: { align: 'center' },
				cell: ({ row }) => (
					<WarehouseRowActions
						row={row}
						onDelete={() => handlePreDelete(row)}
						onEdit={() => handlePreUpdate(row)}
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
				ref={tableRef}
				containerProps={{
					style: { height: 'calc(var(--outlet-wrapper-height) - 12.5rem)' }
				}}
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

export default WarehouseDataTable
