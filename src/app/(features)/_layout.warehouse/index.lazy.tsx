// #region Modules
import { useLayoutStore } from '@/app/(features)/_stores/-layout.store'
import { CommonActions } from '@/common/constants/enums'
import { IWarehouse } from '@/common/types/entities'
import { Button, Checkbox, DataTable, Icon, Tooltip, Typography } from '@/components/ui'
import ConfirmDialog from '@/components/ui/@override/confirm-dialog'
import { fuzzySort } from '@/components/ui/@react-table/utils/fuzzy-sort.util'
import { WarehouseService } from '@/services/warehouse.service'
import { CheckedState } from '@radix-ui/react-checkbox'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Table, createColumnHelper } from '@tanstack/react-table'
import { useResetState } from 'ahooks'
import { Fragment, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { WAREHOUSE_PROVIDE_TAG, useGetWarehouseQuery } from '../_composables/-warehouse.composable'
import WarehouseFormDialog from './_components/-warehouse-form'
import WarehouseRowActions from './_components/-warehouse-row-actions'
import { warehouseTypes } from './_constants/-warehouse.constant'
import { PageContext, PageProvider } from './_contexts/-page-context'
// #endregion

// #region Router declaration
export const Route = createLazyFileRoute('/(features)/_layout/warehouse/')({
	component: () => (
		<PageProvider>
			<Page />
		</PageProvider>
	)
})
// #endregion

// #region Page component
function Page() {
	const { t, i18n } = useTranslation()
	const [formDialogOpen, setFormDialogOpen] = useState<boolean>(false)
	const [rowSelectionType, setRowSelectionType, resetRowSelectionType] = useResetState<RowDeletionType>(undefined)
	const tableRef = useRef<Table<any>>()
	const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false)
	const queryClient = useQueryClient()
	const { dispatch } = useContext(PageContext)

	// Set page breadcrumb navigation
	const setBreadcrumb = useLayoutStore((state) => state.setBreadcrumb)
	setBreadcrumb([{ to: '/warehouse', text: t('ns_common:navigation.warehouse_management') }])

	// Get warehouse data
	const { data, isLoading, refetch } = useGetWarehouseQuery<IWarehouse[]>({
		select: (response) => {
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
		}
	})

	// Delete warehouse
	const { mutateAsync: deleteWarehouseAsync } = useMutation({
		mutationKey: [WAREHOUSE_PROVIDE_TAG],
		mutationFn: WarehouseService.deleteWarehouse,
		onMutate: () => toast.loading(t('ns_common:notification.processing_request')),
		onSuccess: (_data, _variables, context) => {
			toast.success(t('ns_common:notification.success'), { id: context })
			return queryClient.invalidateQueries({ queryKey: [WAREHOUSE_PROVIDE_TAG] })
		},
		onError: (_data, _variables, context) => toast.success(t('ns_common:notification.error'), { id: context }),
		onSettled: () => handleResetAllRowSelection()
	})

	// Update warehouse
	const { mutateAsync: updateWarehouse } = useMutation({
		mutationKey: [WAREHOUSE_PROVIDE_TAG],
		mutationFn: WarehouseService.updateWarehouse,
		onMutate: () => toast.loading(t('ns_common:notification.processing_request')),
		onSuccess: (_data, _variables, context) => {
			toast.success(t('ns_common:notification.success'), { id: context })
			return queryClient.invalidateQueries({ queryKey: [WAREHOUSE_PROVIDE_TAG] })
		},
		onError: (_data, _variables, context) => toast.success(t('ns_common:notification.error'), { id: context })
	})

	// Handle reset row deletion
	const handleResetAllRowSelection = useCallback(() => {
		tableRef.current.resetRowSelection()
		resetRowSelectionType()
	}, [tableRef])

	// Handle delete selected row(s)
	const handleDeleteSelectedRows = useCallback(() => {
		deleteWarehouseAsync(tableRef.current.getSelectedRowModel().flatRows.map((item) => item.original.id))
	}, [tableRef])

	const columnHelper = createColumnHelper<IWarehouse>()

	const columns = useMemo(
		() => [
			columnHelper.accessor('id', {
				id: 'row-selection-column',
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
				meta: { sticky: 'left' },
				size: 50,
				enableSorting: false,
				enableHiding: false,
				enableResizing: false
			}),
			columnHelper.accessor('warehouse_num', {
				header: t('ns_warehouse:fields.warehouse_num'),
				minSize: 150,
				enableColumnFilter: true,
				enableResizing: true,
				enableSorting: true,
				filterFn: 'fuzzy',
				sortingFn: fuzzySort,
				cell: ({ getValue }) => String(getValue()).toUpperCase()
			}),
			columnHelper.accessor('type_warehouse', {
				header: t('ns_warehouse:fields.type_warehouse'),
				minSize: 250,
				enableColumnFilter: true,
				meta: { filterVariant: 'select' }
			}),
			columnHelper.accessor('warehouse_name', {
				header: t('ns_warehouse:fields.warehouse_name'),
				minSize: 250,
				enableResizing: true,
				enableColumnFilter: true,
				filterFn: 'fuzzy',
				sortingFn: fuzzySort,
				enableSorting: true,
				cell: ({ getValue }) => String(getValue()).toUpperCase()
			}),

			columnHelper.accessor('area', {
				header: t('ns_warehouse:fields.area'),
				minSize: 150,
				meta: { filterVariant: 'range' },
				enableColumnFilter: true,
				enableGlobalFilter: false,
				enableResizing: true,
				enableSorting: true,
				sortingFn: fuzzySort,
				cell: ({ getValue }) => new Intl.NumberFormat('en-US', { minimumSignificantDigits: 3 }).format(getValue())
			}),
			columnHelper.accessor('is_disable', {
				header: t('ns_warehouse:fields.is_disable'),
				size: 100,
				cell: ({ getValue, row: { original } }) => {
					const value = getValue()
					return (
						<Checkbox
							role='checkbox'
							checked={value}
							onCheckedChange={(checked) =>
								updateWarehouse({
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
								updateWarehouse({
									id: original.id,
									payload: { is_default: Boolean(checked) }
								})
							}
						/>
					)
				}
			}),
			columnHelper.accessor('remark', {
				header: t('ns_common:common_fields.remark'),
				enableResizing: true,
				cell: ({ getValue }) =>
					getValue() ?? (
						<Typography variant='small' color='muted'>
							-
						</Typography>
					)
			}),
			columnHelper.accessor('id', {
				id: 'actions-column',
				header: t('ns_common:common_fields.actions'),
				maxSize: 100,
				enableResizing: false,
				enableHiding: false,
				meta: { sticky: 'right' },
				cell: ({ row }) => (
					<WarehouseRowActions
						row={row}
						onDelete={() => {
							setConfirmDialogOpen(!confirmDialogOpen)
							setRowSelectionType('single')
							row.toggleSelected(true)
						}}
						onEdit={() => {
							setFormDialogOpen(true)
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
			<Helmet title={t('ns_common:navigation.warehouse_management')} />

			<DataTable
				caption='The list of warehouses'
				data={data}
				columns={columns}
				loading={isLoading}
				enableColumnResizing={true}
				enableRowSelection={true}
				ref={tableRef}
				toolbarProps={{
					slot: () => (
						<Fragment>
							{tableRef.current &&
								tableRef.current.getSelectedRowModel().flatRows.length > 0 &&
								rowSelectionType == 'multiple' && (
									<Tooltip triggerProps={{ asChild: true }} message={t('ns_common:actions.add')}>
										<Button
											variant='destructive'
											size='icon'
											onClick={() => setConfirmDialogOpen(!confirmDialogOpen)}>
											<Icon name='Trash2' />
										</Button>
									</Tooltip>
								)}
							<Tooltip triggerProps={{ asChild: true }} message={t('ns_common:actions.add')}>
								<Button
									variant='outline'
									size='icon'
									onClick={() => {
										setFormDialogOpen(true)
										dispatch({
											type: CommonActions.CREATE,
											payload: { dialogTitle: t('ns_warehouse:form.add_warehouse_title') }
										})
									}}>
									<Icon name='Plus' />
								</Button>
							</Tooltip>
							<Tooltip triggerProps={{ asChild: true }} message={t('ns_common:actions.reload')}>
								<Button variant='outline' size='icon' onClick={() => refetch()}>
									<Icon name='RotateCw' />
								</Button>
							</Tooltip>
						</Fragment>
					)
				}}
			/>
			<WarehouseFormDialog open={formDialogOpen} onOpenChange={setFormDialogOpen} />
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
