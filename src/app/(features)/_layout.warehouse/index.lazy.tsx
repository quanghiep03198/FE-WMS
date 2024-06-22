// #region Modules
import { warehouseTypes } from '@/common/constants/constants'
import { CommonActions } from '@/common/constants/enums'
import { IWarehouse } from '@/common/types/entities'
import { Button, Checkbox, DataTable, Icon, Tooltip, Typography } from '@/components/ui'
import ConfirmDialog from '@/components/ui/@override/confirm-dialog'
import { IndeterminateCheckbox } from '@/components/ui/@react-table/components/indeterminate-checkbox'
import { RowSelectionCheckbox } from '@/components/ui/@react-table/components/row-selection-checkbox'
import { PartialWarehouseFormValue } from '@/schemas/warehouse.schema'
import { WarehouseService } from '@/services/warehouse.service'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Row, createColumnHelper } from '@tanstack/react-table'
import { useResetState } from 'ahooks'
import { Fragment, useCallback, useMemo, useReducer, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useBreadcrumb } from '../_hooks/-use-breadcrumb'
import WarehouseFormDialog, { TFormValues } from './_components/-warehouse-form'
import WarehouseRowActions from './_components/-warehouse-row-actions'
import { formReducer } from './_reducers/-form.reducer'
// #endregion

export const Route = createLazyFileRoute('/(features)/_layout/warehouse/')({
	component: Page
})

function Page() {
	const { t, i18n } = useTranslation()
	const [formDialogOpen, setFormDialogOpen] = useState<boolean>(false)
	const [selectedRows, setSelectedRows, resetSelectedRow] = useResetState<Row<IWarehouse>[]>([])
	const [rowDeletionType, setRowDeletionType, resetRowDeletionType] = useResetState<RowDeletionType>(undefined)
	const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false)
	const queryClient = useQueryClient()

	// Set page breadcrumb
	useBreadcrumb([{ to: '/warehouse', title: t('ns_common:navigation.wh_management') }])

	// Get warehouse data
	const { data, isLoading } = useQuery({
		queryKey: ['warehouses'],
		queryFn: () => WarehouseService.getWarehouseList(),
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
		},
		placeholderData: keepPreviousData
	})

	// Delete warehouse
	const { mutateAsync: deleteWarehouseAsync } = useMutation({
		mutationKey: ['warehouses'],
		mutationFn: WarehouseService.deleteWarehouse,
		onMutate: () => toast.loading(t('ns_common:notification.processing_request')),
		onSuccess: (_data, _variables, context) => {
			resetSelectedRow()
			resetRowDeletionType()
			toast.success(t('ns_common:notification.success'), { id: context })
			return queryClient.invalidateQueries({ queryKey: ['warehouses'] })
		},
		onError: (_data, _variables, context) => toast.success(t('ns_common:notification.error'), { id: context })
	})

	// Update warehouse
	const { mutateAsync: updateWarehouse } = useMutation({
		mutationKey: ['warehouses'],
		mutationFn: (payload: { id: string; data: PartialWarehouseFormValue }) =>
			WarehouseService.updateWarehouse(payload.id, payload.data),
		onMutate: () => toast.loading(t('ns_common:notification.processing_request')),
		onSuccess: (_data, _variables, context) => {
			toast.success(t('ns_common:notification.success'), { id: context })
			return queryClient.invalidateQueries({ queryKey: ['warehouses'] })
		},
		onError: (_data, _variables, context) => toast.success(t('ns_common:notification.error'), { id: context })
	})

	const handleCancelDelete = useCallback(() => {
		resetSelectedRow()
		resetRowDeletionType()
	}, [])

	const [formStates, dispatch] = useReducer(formReducer, { title: undefined, defaultValues: {}, type: undefined })

	const columnHelper = createColumnHelper<IWarehouse>()

	const columns = useMemo(
		() => [
			columnHelper.accessor('id', {
				id: 'row_selection_column',
				header: IndeterminateCheckbox,
				cell: ({ row }) => (
					<RowSelectionCheckbox row={row} onCheckedChange={() => setRowDeletionType('multiple')} />
				),
				meta: { sticky: 'left' },
				size: 56,
				enableSorting: false,
				enableHiding: false,
				enableResizing: false
			}),
			columnHelper.accessor('warehouse_num', {
				header: t('ns_warehouse:fields.warehouse_num'),
				minSize: 160,
				enableColumnFilter: true,
				enableResizing: true,
				enableSorting: true,
				cell: ({ getValue }) => String(getValue()).toUpperCase()
			}),
			columnHelper.accessor('warehouse_name', {
				header: t('ns_warehouse:fields.warehouse_name'),
				minSize: 256,
				enableResizing: true,
				enableColumnFilter: true,
				enableSorting: true,
				cell: ({ getValue }) => String(getValue()).toUpperCase()
			}),
			columnHelper.accessor('type_warehouse', {
				header: t('ns_warehouse:fields.type_warehouse'),
				minSize: 256,
				enableColumnFilter: true,
				filterFn: 'equals'
			}),
			columnHelper.accessor('area', {
				header: t('ns_warehouse:fields.area'),
				minSize: 150,
				enableResizing: true,
				enableSorting: true,
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
									data: {
										is_disable: Boolean(checked),
										is_default: Boolean(checked) ? false : original.is_default
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
									data: { is_default: Boolean(checked) }
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
				id: 'actions_column',
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
							setSelectedRows((prev) => [...prev, row])
							setRowDeletionType('single')
						}}
						onEdit={() => {
							setFormDialogOpen(true)
							dispatch({
								type: CommonActions.UPDATE,
								payload: {
									title: t('ns_warehouse:form.update_warehouse_title'),
									defaultValues: {
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
				rowSelectionState={selectedRows}
				onRowSelectionStateChange={setSelectedRows}
				toolbarProps={{
					slot: (
						<Fragment>
							{selectedRows.length > 0 && rowDeletionType == 'multiple' && (
								<Tooltip triggerProps={{ asChild: true }} message={t('ns_common:actions.add')}>
									<Button
										variant='destructive'
										size='icon'
										onClick={() => setConfirmDialogOpen(!confirmDialogOpen)}>
										<Icon name='Trash' />
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
											payload: { title: t('ns_warehouse:form.add_warehouse_title') }
										})
									}}>
									<Icon name='Plus' />
								</Button>
							</Tooltip>
						</Fragment>
					)
				}}
			/>
			<WarehouseFormDialog
				open={formDialogOpen}
				onOpenChange={setFormDialogOpen}
				onFormActionChange={dispatch}
				{...{
					...formStates,
					defaultValues: formStates.defaultValues as unknown as TFormValues<typeof formStates.type>
				}}
			/>
			<ConfirmDialog
				open={confirmDialogOpen}
				onOpenChange={setConfirmDialogOpen}
				title={t('ns_common:confirmation.delete_title')}
				description={t('ns_common:confirmation.delete_description')}
				onConfirm={() => deleteWarehouseAsync(selectedRows.map((item) => item.original?.id))}
				onCancel={handleCancelDelete}
			/>
		</Fragment>
	)
}
