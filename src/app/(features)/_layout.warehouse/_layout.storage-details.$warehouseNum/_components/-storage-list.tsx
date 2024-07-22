// #region Modules
import { CommonActions } from '@/common/constants/enums'
import { IWarehouseStorage } from '@/common/types/entities'
import { Button, Checkbox, DataTable, Icon, Tooltip, Typography } from '@/components/ui'
import ConfirmDialog from '@/components/ui/@override/confirm-dialog'
import { fuzzySort } from '@/components/ui/@react-table/utils/fuzzy-sort.util'
import { WarehouseStorageService } from '@/services/warehouse-storage.service'
import { CheckedState } from '@radix-ui/react-checkbox'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams } from '@tanstack/react-router'
import { Table, createColumnHelper } from '@tanstack/react-table'
import { useResetState } from 'ahooks'
import { format } from 'date-fns'
import { Fragment, memo, useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
	WAREHOUSE_STORAGE_PROVIDE_TAG,
	useGetWarehouseStorageQuery,
	useUpdateStorageMutation
} from '../../_composables/-use-warehouse-storage-api'
import { warehouseStorageTypes } from '../../_constants/-warehouse.constant'
import { usePageContext } from '../../_contexts/-page-context'
import StorageRowActions from './-storage-row-actions'

// #endregion

type StorageListProps = {
	onFormOpenChange: React.Dispatch<React.SetStateAction<boolean>>
}

const StorageList: React.FC<StorageListProps> = ({ onFormOpenChange }) => {
	const { t, i18n } = useTranslation(['ns_common'])
	const tableRef = useRef<Table<any>>()
	const [rowSelectionType, setRowSelectionType, resetRowSelectionType] = useResetState<RowDeletionType>(undefined)
	const { warehouseNum } = useParams({ strict: false })
	const queryClient = useQueryClient()
	const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false)

	const { dispatch, dialogFormState } = usePageContext()

	// Get original storage type value
	const getOriginalStorageType = useCallback(
		(translatedValue: string) => {
			return Object.keys(warehouseStorageTypes).find((key) => t(warehouseStorageTypes[key]) === translatedValue)
		},
		[i18n.language]
	)

	// Get current warehouse's storage locations
	const { data, isLoading, refetch } = useGetWarehouseStorageQuery<IWarehouseStorage[]>(warehouseNum, {
		select: (response: ResponseBody<IWarehouseStorage[]>): IWarehouseStorage[] => {
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
		}
	})

	// Update warehouse storage location
	const { mutateAsync: updateWarehouseStorage } = useUpdateStorageMutation({ warehouseNum })

	const handleResetAllRowSelection = useCallback(() => {
		tableRef.current.resetRowSelection()
		resetRowSelectionType()
	}, [tableRef])

	const handleDeleteSelectedRows = useCallback(
		() => deleteWarehouseStorage(tableRef.current.getSelectedRowModel().flatRows.map((item) => item.original?.keyid)),
		[tableRef]
	)

	// Delete selected warehouse storage locations
	const { mutateAsync: deleteWarehouseStorage } = useMutation({
		mutationKey: [WAREHOUSE_STORAGE_PROVIDE_TAG, warehouseNum],
		mutationFn: WarehouseStorageService.deleteWarehouseStorage,
		onMutate: () => toast.loading(t('ns_common:notification.processing_request')),
		onSuccess: (_data, _variables, context) => {
			toast.success(t('ns_common:notification.success'), { id: context })
			return queryClient.invalidateQueries({ queryKey: [WAREHOUSE_STORAGE_PROVIDE_TAG, warehouseNum] })
		},
		onError: (_data, _variables, context) => {
			toast.error(t('ns_common:notification.error'), { id: context })
		},
		onSettled: handleResetAllRowSelection
	})

	const columnHelper = createColumnHelper<IWarehouseStorage>()

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
								if (checkedState) setRowSelectionType('multiple')
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
				meta: { filterVariant: 'select' }
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
				enableSorting: true,
				sortingFn: fuzzySort
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
								row.toggleSelected(true)
								setRowSelectionType('single')
							}}
							onEdit={() => {
								onFormOpenChange(true)
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
		<>
			<DataTable
				ref={tableRef}
				data={data}
				loading={isLoading}
				columns={columns}
				enableColumnResizing={true}
				enableColumnFilters={true}
				enableRowSelection={true}
				toolbarProps={{
					slot: () => (
						<Fragment>
							{tableRef.current &&
								tableRef.current.getSelectedRowModel().flatRows.length > 0 &&
								rowSelectionType === 'multiple' && (
									<Tooltip triggerProps={{ asChild: true }} message={t('ns_common:actions.add')}>
										<Button
											variant='destructive'
											size='icon'
											onClick={() => setConfirmDialogOpen((prev) => !prev)}>
											<Icon name='Trash2' />
										</Button>
									</Tooltip>
								)}
							<Tooltip triggerProps={{ asChild: true }} message={t('ns_common:actions.add')}>
								<Button
									variant='outline'
									size='icon'
									onClick={() => {
										onFormOpenChange(true)
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
		</>
	)
}

export default memo(StorageList)