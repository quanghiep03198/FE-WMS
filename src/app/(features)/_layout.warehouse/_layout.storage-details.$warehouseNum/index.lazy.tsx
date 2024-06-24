// #region Modules
import { Fragment, useCallback, useContext, useMemo, useState } from 'react'
import { CheckedState } from '@radix-ui/react-checkbox'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createLazyFileRoute, useParams } from '@tanstack/react-router'
import { Row, createColumnHelper } from '@tanstack/react-table'
import { useResetState } from 'ahooks'
import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useBreadcrumb } from '@/app/(features)/_hooks/-use-breadcrumb'
import { warehouseStorageTypes } from '@/common/constants/constants'
import { CommonActions } from '@/common/constants/enums'
import useQueryParams from '@/common/hooks/use-query-params'
import { IWarehouseStorageArea } from '@/common/types/entities'
import { Button, Checkbox, DataTable, Icon, Tooltip, Typography } from '@/components/ui'
import ConfirmDialog from '@/components/ui/@override/confirm-dialog'
import { PartialStorageFormValue } from '@/schemas/warehouse.schema'
import { WarehouseStorageService } from '@/services/warehouse-storage.service'
import { WAREHOUSE_STORAGE_LIST_KEY } from '../../_constants/-query-key'
import { PageContext, PageProvider } from '../_contexts/-page-context'
import WarehouseStorageFormDialog from './_components/-storage-form'
import StorageRowActions from './_components/-storage-row-actions'
// #endregion

// #region Router declaration
export const Route = createLazyFileRoute('/(features)/_layout/warehouse/_layout/storage-details/$warehouseNum/')({
	component: () => (
		<PageProvider>
			<Page />
		</PageProvider>
	)
})
// #endregion

// #region Page component
function Page() {
	const [selectedRows, setSelectedRows, resetSelectedRow] = useResetState<Row<IWarehouseStorageArea>[]>([])
	const [rowSelectionType, setRowSelectionType, resetRowSelectionType] = useResetState<RowDeletionType>(undefined)
	const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false)
	const [formDialogOpenState, setFormDialogOpenState] = useState<boolean>(false)
	const { warehouseNum } = useParams({ strict: false })
	const { t, i18n } = useTranslation(['ns_common'])
	const queryClient = useQueryClient()
	const { dispatch } = useContext(PageContext)
	const { searchParams } = useQueryParams()

	useBreadcrumb([
		{
			text: t('ns_common:navigation.warehouse_commands'),
			to: '/warehouse'
		},
		{
			text: t('ns_common:navigation.storage_detail'),
			to: '/warehouse/storage-details/$warehouseNum',
			params: { warehouseNum },
			search: searchParams
		},
		{
			text: warehouseNum,
			to: '/warehouse/storage-details/$warehouseNum',
			params: { warehouseNum },
			search: searchParams
		}
	])

	const handleResetAllRowSelection = useCallback(() => {
		resetSelectedRow()
		resetRowSelectionType()
	}, [])

	const getOriginalStorageType = useCallback(
		(translatedValue: string) => {
			return Object.keys(warehouseStorageTypes).find((key) => t(warehouseStorageTypes[key]) === translatedValue)
		},
		[i18n.language]
	)

	const { data, isLoading } = useQuery({
		queryKey: [WAREHOUSE_STORAGE_LIST_KEY, warehouseNum],
		queryFn: () => WarehouseStorageService.getWarehouseStorages(warehouseNum),
		select: (response: ResponseBody<IWarehouseStorageArea[]>) => {
			return Array.isArray(response.metadata)
				? response.metadata.map((item) => ({
						...item,
						created: format(item.created, 'yyyy-MM-dd'),
						type_storage: t(warehouseStorageTypes[item.type_storage], {
							ns: 'ns_warehouse',
							defaultValue: item.type_storage
						})
					}))
				: []
		},
		placeholderData: keepPreviousData
	})

	const { mutateAsync: updateWarehouseStorage } = useMutation({
		mutationKey: [WAREHOUSE_STORAGE_LIST_KEY, warehouseNum],
		mutationFn: (data: { storageNum: string; payload: PartialStorageFormValue }) =>
			WarehouseStorageService.updateWarehouseStorage(data.storageNum, data.payload),
		onMutate: () => toast.loading(t('ns_common:notification.processing_request')),
		onSuccess: (_data, _variables, context) => {
			toast.success(t('ns_common:notification.success'), { id: context })
			return queryClient.invalidateQueries({ queryKey: [WAREHOUSE_STORAGE_LIST_KEY, warehouseNum] })
		},
		onError: (_data, _variables, context) => toast.error(t('ns_common:notification.error'), { id: context })
	})

	const { mutateAsync: deleteWarehouseStorage } = useMutation({
		mutationKey: [WAREHOUSE_STORAGE_LIST_KEY, warehouseNum],
		mutationFn: WarehouseStorageService.deleteWarehouseStorage,
		onMutate: () => toast.loading(t('ns_common:notification.processing_request')),
		onSuccess: (_data, _variables, context) => {
			toast.success(t('ns_common:notification.success'), { id: context })
			return queryClient.invalidateQueries({ queryKey: [WAREHOUSE_STORAGE_LIST_KEY, warehouseNum] })
		},
		onError: (_data, _variables, context) => {
			toast.error(t('ns_common:notification.error'), { id: context })
		},
		onSettled: handleResetAllRowSelection
	})

	const columnHelper = createColumnHelper<IWarehouseStorageArea>()

	const columns = useMemo(
		() => [
			columnHelper.accessor('keyid', {
				id: 'row-selection-column',
				header: ({ table }) => {
					const checked =
						table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')

					return (
						<Checkbox
							role='checkbox'
							checked={checked as CheckedState}
							onCheckedChange={(checkedState) => {
								table.toggleAllPageRowsSelected(!!checkedState)
								if (!checkedState) {
									handleResetAllRowSelection()
									return
								}
								setRowSelectionType('multiple')
								setSelectedRows(table.getPreSelectedRowModel().flatRows)
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
							row.toggleSelected(Boolean(checkedState))
							if (!checkedState) {
								setSelectedRows((prev) => {
									const filtered = prev.filter((selectedRow) => selectedRow.id !== row.id)
									if (filtered.length === 0) handleResetAllRowSelection()
									return filtered
								})
								return
							}

							setSelectedRows((prev) => {
								setRowSelectionType('multiple')
								return [...prev, row]
							})
						}}
					/>
				),
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
								setRowSelectionType('single')
							}}
							onEdit={() => {
								setFormDialogOpenState(true)
								dispatch({
									type: CommonActions.UPDATE,
									payload: {
										dialogTitle: t('ns_common:common_form_titles.update', {
											object: t('ns_common:specialized_vocabs.storage_area')
										}),
										defaultFormValues: {
											...row.original,
											type_storage: getOriginalStorageType(row.original.type_storage)
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
							{selectedRows.length > 0 && rowSelectionType === 'multiple' && (
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
											type: 'CREATE',
											payload: {
												dialogTitle: t('ns_common:common_form_titles.create', {
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
			<WarehouseStorageFormDialog open={formDialogOpenState} onOpenChange={setFormDialogOpenState} />
			<ConfirmDialog
				open={confirmDialogOpen}
				onOpenChange={setConfirmDialogOpen}
				title={t('ns_common:confirmation.delete_title')}
				description={t('ns_common:confirmation.delete_description')}
				onConfirm={() => deleteWarehouseStorage(selectedRows.map((item) => item.original?.keyid))}
				onCancel={handleResetAllRowSelection}
			/>
		</Fragment>
	)
}
