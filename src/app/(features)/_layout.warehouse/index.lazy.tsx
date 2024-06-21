// #region Modules
import { WarehouseTypes } from '@/common/constants/constants'
import useQueryParams from '@/common/hooks/use-query-params'
import { IWarehouse } from '@/common/types/entities'
import Loading from '@/components/shared/loading'
import {
	Button,
	Checkbox,
	DataTable,
	DataTableRowActions,
	Div,
	DropdownMenuItem,
	Icon,
	Tooltip,
	Typography
} from '@/components/ui'
import ConfirmDialog from '@/components/ui/@override/confirm-dialog'
import { WarehouseService } from '@/services/warehouse.service'
import { CheckedState } from '@radix-ui/react-checkbox'
import { keepPreviousData, queryOptions, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, createLazyFileRoute, useMatchRoute, useRouter } from '@tanstack/react-router'
import { Row, createColumnHelper } from '@tanstack/react-table'
import { ResourceKeys } from 'i18next'
import _ from 'lodash'
import { Fragment, useCallback, useContext, useLayoutEffect, useMemo, useReducer, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import WarehouseFormDialog from './_components/-warehouse-form'
import { IndeterminateCheckbox } from '@/components/ui/@react-table/components/indeterminate-checkbox'
import { RowSelectionCheckbox } from '@/components/ui/@react-table/components/row-selection-checkbox'
import { warehouseQuery } from './_composables/-warehouse.composable'
import WarehouseRowActions from './_components/-warehouse-row-actions'
import { PartialWarehouseFormValue } from '@/schemas/warehouse.schema'
import { CommonActions } from '@/common/constants/enums'
import { BreadcrumbContext } from '@/components/providers/breadcrumbs-provider'
import { useDeepCompareLayoutEffect } from 'ahooks'
import { useBreadcrumb } from '@/common/hooks/use-breadcrumb'
import { warehouses } from '@/mocks/warehouse.data'
// #endregion

export const Route = createLazyFileRoute('/(features)/_layout/warehouse/')({
	component: Page,
	pendingComponent: Loading
})

export type FormAction = {
	type: CommonActions
	payload?: {
		title: ResourceKeys['ns_warehouse'] | undefined
		defaultValues?: Partial<IWarehouse> | undefined
		type?: CommonActions
	}
}

const formReducer = (_, action: FormAction) => {
	switch (action.type) {
		case CommonActions.CREATE:
			return { ...action.payload, type: action.type, defaultValues: {} }
		case CommonActions.UPDATE:
			return { ...action.payload, type: action.type }
		default:
			return {
				type: undefined,
				title: undefined,
				defaultValues: {}
			}
	}
}

function Page() {
	const { t, i18n } = useTranslation()
	const columnHelper = createColumnHelper<IWarehouse>()
	const { searchParams } = useQueryParams({ page: 1, limit: 10 })
	const [open, setOpen] = useState<boolean>(false)
	const [selectedRows, setSelectedRows] = useState<Row<IWarehouse>[]>([])
	const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false)
	const queryClient = useQueryClient()
	const { data, isLoading } = useQuery(warehouseQuery(searchParams))
	const [isSingleDelete, setIsSingleDelete] = useState<boolean>(false)

	useBreadcrumb([{ href: '/warehouse', title: t('ns_common:navigation.wh_management') }])

	// Delete warehouse query
	const { mutateAsync: deleteWarehouseAsync } = useMutation({
		mutationKey: ['warehouses', searchParams],
		mutationFn: WarehouseService.deleteWarehouse,
		onMutate: () => {
			const id = crypto.randomUUID()
			toast.loading(t('ns_common:notification.processing_request'), { id })
			return { id }
		},
		onSuccess: (_data, _variables, { id }) => {
			toast.success(t('ns_common:notification.success'), { id })
			return queryClient.invalidateQueries({ queryKey: ['warehouses', searchParams] })
		},
		onError: (_data, _variables, { id }) => toast.success(t('ns_common:notification.error'), { id })
	})

	const { mutate: updateWarehouse } = useMutation({
		mutationKey: ['warehouses'],
		mutationFn: (payload: { id: string; data: Partial<IWarehouse> }) =>
			WarehouseService.updateWarehouse(payload.id, payload.data),
		// onMutate: () => toast.loading(t('ns_common:notification.processing_request')),
		onSuccess: (_data, _variables, context) => {
			// toast.success(t('ns_common:notification.success'), { id: context })
			return queryClient.invalidateQueries({ queryKey: ['warehouses'] })
		}
		// onError: (_data, _variables, context) => toast.error(t('ns_common:notification.error'), { id: context })
	})

	const handleCancelDelete = useCallback(() => {
		setSelectedRows([])
		setIsSingleDelete(true)
	}, [])

	const [formStates, dispatch] = useReducer(formReducer, { title: null, defaultValues: null, type: undefined })

	const columns = useMemo(
		() => [
			columnHelper.accessor('id', {
				id: 'row_selection_column',
				header: IndeterminateCheckbox,
				cell: RowSelectionCheckbox,
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
				filterFn: 'equals',
				cell: ({ getValue }) => {
					const warehouseTypeKey = getValue()
					return t(WarehouseTypes[warehouseTypeKey], { ns: 'ns_warehouse', defaultValue: warehouseTypeKey })
				}
			}),
			columnHelper.accessor('area', {
				header: t('ns_warehouse:fields.area'),
				minSize: 150,
				enableResizing: true,
				enableSorting: true,
				cell: ({ getValue }) => String(getValue()).toUpperCase()
			}),
			columnHelper.accessor('is_disable', {
				header: t('ns_warehouse:fields.is_disable'),
				size: 100,
				cell: ({ getValue, row: { original } }) => {
					const value = Boolean(getValue())
					return (
						<Checkbox
							role='checkbox'
							aria-disabled={Boolean(getValue())}
							checked={Boolean(getValue())}
							onCheckedChange={(checked) =>
								updateWarehouse({
									id: original.id,
									data: {
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
							disabled={Boolean(original.is_disable)}
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
				cell: ({ getValue }) => getValue() ?? '-'
			}),
			columnHelper.accessor('id', {
				id: 'actions_column',
				header: t('ns_common:common_fields.actions'),
				maxSize: 100,
				enableResizing: false,
				meta: { sticky: 'right' },
				cell: ({ row }) => (
					<WarehouseRowActions
						row={row}
						enableDeleting={!row.original.is_disable}
						enableEditing={!row.original.is_disable}
						onDelete={() => {
							setConfirmDialogOpen(!confirmDialogOpen)
							setSelectedRows((prev) => [...prev, row])
							setIsSingleDelete(true)
						}}
						onEdit={() => {
							setOpen(true)
							dispatch({
								type: CommonActions.UPDATE,
								payload: { title: 'form.update_warehouse_title', defaultValues: row.original }
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
			<Div className='mb-6 space-y-1'>
				<Typography variant='h6' className='font-bold'>
					{t('ns_warehouse:headings.warehouse_list_title')}
				</Typography>
				<Typography variant='p' color='muted'>
					{t('ns_warehouse:headings.warehouse_list_description')}
				</Typography>
			</Div>
			<DataTable
				data={data}
				columns={columns}
				loading={isLoading}
				enableColumnResizing={true}
				rowSelection={selectedRows}
				enableRowSelection={true}
				manualPagination={false}
				onRowSelectionStateChange={setSelectedRows}
				toolbarProps={{
					slot: (
						<Fragment>
							{selectedRows.length > 0 && isSingleDelete == false && (
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
										setOpen(true)
										dispatch({ type: CommonActions.CREATE, payload: { title: 'form.add_warehouse_title' } })
									}}>
									<Icon name='Plus' />
								</Button>
							</Tooltip>
						</Fragment>
					)
				}}
			/>
			<WarehouseFormDialog open={open} onOpenChange={setOpen} onFormActionChange={dispatch} {...formStates} />
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
