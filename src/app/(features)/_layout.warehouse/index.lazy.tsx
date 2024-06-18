// #region Import
import Loading from '@/components/shared/loading'
import { createLazyFileRoute } from '@tanstack/react-router'
import { WarehouseTypes } from '@/common/constants/constants'
import useQueryParams from '@/common/hooks/use-query-params'
import { IWarehouse } from '@/common/types/entities'
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
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { createColumnHelper } from '@tanstack/react-table'
import { ResourceKeys } from 'i18next'
import _ from 'lodash'
import { Fragment, useMemo, useReducer, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import WarehouseFormDialog from './_components/-warehouse-form'
// #endregion

export const Route = createLazyFileRoute('/(features)/_layout/warehouse/')({
	component: WarehouseList,
	pendingComponent: Loading
})

type FormActionType = 'add' | 'update' | undefined

export type FormAction = {
	type: FormActionType
	payload?: {
		title: ResourceKeys['ns_warehouse'] | undefined
		defaultValues?: Partial<IWarehouse> | undefined
		type?: FormActionType
	}
}

const formReducer = (_, action: FormAction) => {
	switch (action.type) {
		case 'add':
			return { ...action.payload, type: action.type, defaultValues: {} }
		case 'update':
			return { ...action.payload, type: action.type }
		default:
			return {
				type: undefined,
				title: undefined,
				defaultValues: {}
			}
	}
}

function WarehouseList() {
	const { t, i18n } = useTranslation('ns_warehouse')
	const columnHelper = createColumnHelper<IWarehouse>()
	const { searchParams } = useQueryParams({ page: 1, limit: 20 })
	const [open, setOpen] = useState<boolean>(false)
	const [selectedWarehouses, setSelectedWarehouses] = useState<string[]>([])
	const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false)
	const queryClient = useQueryClient()

	const { data, isFetching } = useQuery({
		queryKey: ['warehouses', searchParams],
		queryFn: () => WarehouseService.getWarehouseList(searchParams),
		select: (data) => data.metadata,
		placeholderData: keepPreviousData
	})

	const { mutateAsync: deleteWarehouseAsync } = useMutation({
		mutationKey: ['warehouses', searchParams],
		mutationFn: WarehouseService.deleteWarehouse,
		onMutate: () => {
			const id = crypto.randomUUID()
			toast.loading(t('ns_common:notification.processing_request'), { id })
			return { id }
		},
		onSuccess: (_data, _vars, { id }) => {
			toast.success(t('ns_common:notification.success'), { id })
			return queryClient.invalidateQueries({ queryKey: ['warehouses'] })
		},
		onError: (_data, _vars, { id }) => toast.success(t('ns_common:notification.error'), { id })
	})

	const [formStates, dispatch] = useReducer(formReducer, { title: null, defaultValues: null, type: undefined })

	const columns = useMemo(
		() => [
			columnHelper.accessor('id', {
				id: 'row_selection_column',
				header: ({ table }) => {
					const checked = (table.getIsAllPageRowsSelected() ||
						(table.getIsSomePageRowsSelected() && 'indeterminate')) as CheckedState
					return (
						<Checkbox
							role='checkbox'
							checked={checked}
							onCheckedChange={(value) => {
								table.toggleAllPageRowsSelected(!!value)
							}}
						/>
					)
				},
				meta: { sticky: 'left' },
				cell: ({ row }) => (
					<Checkbox
						aria-label='Select row'
						role='checkbox'
						checked={row.getIsSelected()}
						onCheckedChange={(value) => {
							row.toggleSelected(!!value)
						}}
					/>
				),
				size: 56,
				enableSorting: false,
				enableHiding: false,
				enableResizing: false
			}),
			columnHelper.accessor('warehouse_num', {
				header: t('ns_warehouse:fields.warehouse_num'),
				size: 200,
				enableColumnFilter: true,
				enableResizing: true,
				cell: ({ getValue }) => String(getValue()).toUpperCase()
			}),
			columnHelper.accessor('warehouse_name', {
				header: t('ns_warehouse:fields.warehouse_name'),
				minSize: 200,
				enableResizing: true,
				enableColumnFilter: true,
				cell: ({ getValue }) => String(getValue()).toUpperCase()
			}),
			columnHelper.accessor('type_warehouse', {
				header: t('ns_warehouse:fields.type_warehouse'),
				minSize: 200,
				cell: ({ getValue }) => {
					const warehouseTypeKey = getValue()
					return t(WarehouseTypes[warehouseTypeKey], { defaultValue: warehouseTypeKey })
				}
			}),
			columnHelper.accessor('area', {
				header: t('ns_warehouse:fields.area'),
				minSize: 150,
				enableResizing: true,
				cell: ({ getValue }) => String(getValue()).toUpperCase()
			}),
			columnHelper.accessor('is_disable', {
				header: t('ns_warehouse:fields.is_disable'),
				size: 100,
				cell: ({ getValue }) => <Checkbox role='checkbox' defaultChecked={Boolean(getValue())} />
			}),
			columnHelper.accessor('is_default', {
				header: t('ns_warehouse:fields.is_default'),
				minSize: 200,
				cell: ({ getValue }) => <Checkbox role='checkbox' defaultChecked={Boolean(getValue())} />
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
				cell: ({ getValue, row }) => (
					<DataTableRowActions
						enableDeleting
						enableEditing
						onDelete={() => {
							setConfirmDialogOpen(!confirmDialogOpen)
							setSelectedWarehouses(
								(prev) => [getValue()]
								// [...new Set([...prev, getValue()])]
							)
						}}
						onEdit={() => {
							setOpen(true)
							dispatch({
								type: 'update',
								payload: { title: 'form.update_warehouse_title', defaultValues: row.original }
							})
						}}
						slot={
							<DropdownMenuItem asChild className='flex items-center gap-x-3'>
								<Link to={`/warehouse/warehouse/$id`} params={{ id: getValue() }}>
									<Icon name='SquareDashedMousePointer' />
									{t('ns_common:actions.detail')}
								</Link>
							</DropdownMenuItem>
						}
					/>
				)
			})
		],
		[i18n.language]
	)

	return (
		<Fragment>
			<Div className='mb-6 space-y-2'>
				<Typography variant='h6' className='font-bold'>
					{t('ns_common:navigation.wh_management')}
				</Typography>
				<Typography variant='p' color='muted'></Typography>
			</Div>
			<DataTable
				data={_.pick(data, ['data']).data}
				columns={columns}
				enableColumnResizing={true}
				containerProps={{ style: { height: '384px' } }}
				toolbarProps={{
					slot: (
						<Fragment>
							<Tooltip triggerProps={{ asChild: true }} message={t('ns_common:actions.add')}>
								<Button
									variant='outline'
									size='icon'
									onClick={() => {
										setOpen(true)
										dispatch({
											type: 'add',
											payload: { title: 'form.add_warehouse_title' }
										})
									}}>
									<Icon name='Plus' />
								</Button>
							</Tooltip>
						</Fragment>
					)
				}}
				paginationProps={{
					manualPagination: true,
					..._.omit(data, ['data'])
				}}
			/>
			<WarehouseFormDialog open={open} onOpenChange={setOpen} onFormActionChange={dispatch} {...formStates} />
			<ConfirmDialog
				open={confirmDialogOpen}
				onOpenChange={setConfirmDialogOpen}
				title={t('ns_common:confirmation.delete_title')}
				description={t('ns_common:confirmation.delete_description')}
				onConfirm={() => deleteWarehouseAsync(selectedWarehouses)}
				onCancel={() => setSelectedWarehouses([])}
			/>
		</Fragment>
	)
}
