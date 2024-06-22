// #region Modules
import { useBreadcrumb } from '@/app/(features)/_hooks/-use-breadcrumb'
import { warehouseStorageTypes } from '@/common/constants/constants'
import { CommonActions } from '@/common/constants/enums'
import { IWarehouseStorageArea } from '@/common/types/entities'
import Loading from '@/components/shared/loading'
import { Button, Checkbox, DataTable, Icon, Tooltip, Typography } from '@/components/ui'
import ConfirmDialog from '@/components/ui/@override/confirm-dialog'
import { IndeterminateCheckbox } from '@/components/ui/@react-table/components/indeterminate-checkbox'
import { RowSelectionCheckbox } from '@/components/ui/@react-table/components/row-selection-checkbox'
import { PartialStorageFormValue } from '@/schemas/warehouse.schema'
import { WarehouseStorageService } from '@/services/warehouse-storage.service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createLazyFileRoute, useParams } from '@tanstack/react-router'
import { Row, createColumnHelper } from '@tanstack/react-table'
import { useResetState } from 'ahooks'
import { format } from 'date-fns'
import { Fragment, useCallback, useMemo, useReducer, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { formReducer } from '../_reducers/-form.reducer'
import WarehouseStorageFormDialog, { FormValues } from './_components/-storage-form'
import StorageRowActions from './_components/-storage-row-actions'
// #endregion

export const Route = createLazyFileRoute('/(features)/_layout/warehouse/_layout/storage-details/$warehouseNum/')({
	component: Page,
	pendingComponent: Loading
})

function Page() {
	const [selectedRows, setSelectedRows, resetSelectedRow] = useResetState<Row<IWarehouseStorageArea>[]>([])
	const [rowDeletionType, setRowDeletionType, resetRowDeletionType] = useResetState<RowDeletionType>(undefined)
	const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false)
	const [formDialogOpenState, setFormDialogOpenState] = useState<boolean>(false)
	const { warehouseNum } = useParams({ strict: false })
	const { t, i18n } = useTranslation(['ns_common'])
	const queryClient = useQueryClient()

	useBreadcrumb([
		{
			to: '/warehouse',
			title: t('ns_common:navigation.wh_management')
		},
		{
			to: '/warehouse/storage-details/$warehouseNum',
			title: t('ns_common:navigation.wh_storage_detail'),
			params: { warehouseNum }
		},
		{
			to: '/warehouse/storage-details/$warehouseNum',
			title: warehouseNum,
			params: { warehouseNum }
		}
	])

	const { data, isLoading } = useQuery({
		queryKey: ['warehouse-storage', warehouseNum],
		queryFn: () => WarehouseStorageService.getWarehouseStorages(warehouseNum),
		select: (response) =>
			Array.isArray(response.metadata)
				? response.metadata.map((item) => ({
						...item,
						created: format(item.created, 'yyyy-MM-dd'),
						type_storage: t(warehouseStorageTypes[item.type_storage], {
							ns: 'ns_warehouse',
							defaultValue: item.type_storage
						})
					}))
				: []
	})

	const { mutateAsync: updateWarehouseStorage } = useMutation({
		mutationKey: ['warehouse-storage', warehouseNum],
		mutationFn: (data: { storageNum: string; payload: PartialStorageFormValue }) =>
			WarehouseStorageService.updateWarehouseStorage(data.storageNum, data.payload),
		onMutate: () => toast.loading(t('ns_common:notification.processing_request')),
		onSuccess: (_data, _variables, context) => {
			toast.success(t('ns_common:notification.success'), { id: context })
			return queryClient.invalidateQueries({ queryKey: ['warehouse-storage', warehouseNum] })
		},
		onError: (_data, _variables, context) => toast.error(t('ns_common:notification.error'), { id: context })
	})

	const { mutateAsync: deleteWarehouseStorage } = useMutation({
		mutationKey: ['warehouse-storage', warehouseNum],
		mutationFn: WarehouseStorageService.deleteWarehouseStorage,
		onMutate: () => toast.loading(t('ns_common:notification.processing_request')),
		onSuccess: (_data, _variables, context) => {
			toast.success(t('ns_common:notification.success'), { id: context })
			return queryClient.invalidateQueries({ queryKey: ['warehouse-storage', warehouseNum] })
		},
		onError: (_data, _variables, context) => {
			toast.error(t('ns_common:notification.error'), { id: context })
		},
		onSettled: () => {
			resetRowDeletionType()
			resetSelectedRow()
		}
	})

	const [formStates, dispatch] = useReducer(formReducer, { title: null, defaultValues: null, type: undefined })

	const columnHelper = createColumnHelper<IWarehouseStorageArea>()

	const columns = useMemo(
		() => [
			columnHelper.accessor('keyid', {
				id: 'row_selection_column',
				header: IndeterminateCheckbox,
				cell: (props) => <RowSelectionCheckbox onCheckedChange={() => setRowDeletionType('multiple')} {...props} />,
				meta: { sticky: 'left' },
				size: 50,
				enableSorting: false,
				enableHiding: false,
				enableResizing: false
			}),
			columnHelper.accessor('storage_num', {
				header: t('ns_warehouse:fields.storage_num'),
				enableSorting: true,
				enableColumnFilter: true,
				enableHiding: false
			}),
			columnHelper.accessor('storage_name', {
				header: t('ns_warehouse:fields.storage_name'),
				enableSorting: true,
				enableColumnFilter: true,
				enableHiding: false
			}),
			columnHelper.accessor('type_storage', {
				header: t('ns_warehouse:fields.type_storage'),
				enableSorting: true,
				enableColumnFilter: true,
				enableHiding: false
			}),
			columnHelper.accessor('warehouse_name', {
				header: t('ns_warehouse:fields.warehouse_name'),
				enableSorting: true,
				enableColumnFilter: true,
				enableHiding: false
			}),
			columnHelper.accessor('is_disable', {
				header: t('ns_warehouse:fields.is_disable'),
				size: 100,
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
									storageNum: original.storage_num,
									payload: {
										is_disable: Boolean(checked),
										is_default: Boolean(checked) ? false : Boolean(original.is_default)
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
							onCheckedChange={async (checked) =>
								await updateWarehouseStorage({
									storageNum: original.storage_num,
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
				enableSorting: true
			}),
			columnHelper.accessor('remark', {
				header: t('ns_common:common_fields.remark'),
				cell: ({ getValue }) =>
					getValue() ?? (
						<Typography variant='small' color='muted'>
							-
						</Typography>
					)
			}),
			columnHelper.accessor('keyid', {
				header: t('ns_common:common_fields.actions'),
				meta: { sticky: 'right' },
				size: 100,
				cell: ({ row }) => {
					return (
						<StorageRowActions
							row={row}
							onDelete={() => {
								setConfirmDialogOpen(!confirmDialogOpen)
								setSelectedRows((prev) => [...prev, row])
								setRowDeletionType('single')
							}}
							onEdit={() => {
								setFormDialogOpenState(true)
								dispatch({
									type: CommonActions.UPDATE,
									payload: {
										title: t('ns_common:common_form_titles.update', {
											object: t('ns_common:specialized_vocabs.storage_area')
										}),
										defaultValues: {
											...row.original,
											type_storage: Object.keys(warehouseStorageTypes).find(
												(key) => t(warehouseStorageTypes[key]) === row.original.type_storage
											)
										}
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

	const handleCancelDelete = useCallback(() => {
		resetSelectedRow()
		resetRowDeletionType()
	}, [])

	return (
		<Fragment>
			<DataTable
				data={data}
				loading={isLoading}
				columns={columns}
				enableColumnResizing={true}
				enableColumnFilters={true}
				enableRowSelection={true}
				toolbarProps={{
					slot: (
						<Fragment>
							{selectedRows.length > 0 && rowDeletionType === 'multiple' && (
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
										setFormDialogOpenState(true)
										dispatch({
											type: CommonActions.CREATE,
											payload: {
												title: t('ns_common:common_form_titles.create', {
													object: t('ns_common:specialized_vocabs.storage_area')
												})
											}
										})
									}}>
									<Icon name='Plus' />
								</Button>
							</Tooltip>
						</Fragment>
					)
				}}
			/>

			<WarehouseStorageFormDialog
				open={formDialogOpenState}
				onOpenChange={setFormDialogOpenState}
				onFormActionChange={dispatch}
				{...{
					...formStates,
					defaultValues: formStates.defaultValues as unknown as FormValues<typeof formStates.type>
				}}
			/>
			<ConfirmDialog
				open={confirmDialogOpen}
				onOpenChange={setConfirmDialogOpen}
				title={t('ns_common:confirmation.delete_title')}
				description={t('ns_common:confirmation.delete_description')}
				onConfirm={() => deleteWarehouseStorage(selectedRows.map((item) => item.original?.keyid))}
				onCancel={handleCancelDelete}
			/>
		</Fragment>
	)
}
