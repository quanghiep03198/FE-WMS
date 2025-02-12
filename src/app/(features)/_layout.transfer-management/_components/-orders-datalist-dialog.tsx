import { PresetBreakPoints } from '@/common/constants/enums'
import useMediaQuery from '@/common/hooks/use-media-query'
import { ITransferOrderData } from '@/common/types/entities'
import {
	Button,
	Checkbox,
	DataTable,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	Icon,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Separator,
	Tooltip
} from '@/components/ui'
import { fuzzySort } from '@/components/ui/@react-table/utils/fuzzy-sort.util'
import { CheckedState } from '@radix-ui/react-checkbox'
import { Table, createColumnHelper } from '@tanstack/react-table'
import { useUpdate } from 'ahooks'
import { Fragment, useCallback, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useAddTransferOrderMutation, useGetTransferOrderDatalist } from '../_apis/-use-transfer-order-api'
import { usePageStore } from '../_stores/page.store'
import OrderDatalistSearchForm from './-order-datalist-search-form'

const OrderDatalistDialog: React.FC = () => {
	const { datalistDialogOpen, toggleDatalistDialogOpen } = usePageStore()
	const { t, i18n } = useTranslation()
	const isSmallScreen = useMediaQuery(PresetBreakPoints.SMALL)
	const tableRef = useRef<Table<any>>(null)
	const update = useUpdate()

	const columnHelper = createColumnHelper<ITransferOrderData>()
	const columns = useMemo(
		() => [
			columnHelper.accessor((row) => row.id, {
				id: 'row-selection-column',
				header: ({ table }) => {
					const checked =
						table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
					return (
						<Checkbox
							role='checkbox'
							checked={checked as CheckedState}
							onCheckedChange={(checkedState) => {
								update()
								table.toggleAllRowsSelected(!!checkedState)
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
							update()
							row.toggleSelected(Boolean(checkedState))
						}}
					/>
				),
				meta: { sticky: 'left' },
				maxSize: 50,
				size: 50,
				enableSorting: false,
				enableHiding: false,
				enableResizing: false
			}),

			columnHelper.accessor('brand_name', {
				header: t('ns_erp:fields.brand_name'),
				enableColumnFilter: true,
				enableSorting: true,
				filterFn: 'fuzzy',
				sortingFn: fuzzySort
			}),
			columnHelper.accessor('kg_no', {
				header: t('ns_erp:fields.packaging_code'),
				cell: ({ getValue }) => {
					const value = getValue()
					return value ? String(value).toUpperCase() : '-'
				},
				enableColumnFilter: true,
				enableSorting: true,
				filterFn: 'fuzzy',
				sortingFn: fuzzySort
			}),
			columnHelper.accessor('mo_no', {
				header: t('ns_erp:fields.mo_no'),
				cell: ({ getValue }) => {
					const value = getValue()
					return value ? String(value).toUpperCase() : '-'
				},
				enableColumnFilter: true,
				enableSorting: true,
				filterFn: 'fuzzy',
				sortingFn: fuzzySort
			}),
			columnHelper.accessor('or_no', {
				header: t('ns_erp:fields.or_no'),
				cell: ({ getValue }) => {
					const value = getValue()
					return value ? String(value).toUpperCase() : '-'
				},
				enableColumnFilter: true,
				enableSorting: true,
				filterFn: 'fuzzy',
				sortingFn: fuzzySort
			}),
			columnHelper.accessor('or_custpo', {
				header: t('ns_erp:fields.or_custpo'),
				cell: ({ getValue }) => {
					const value = getValue()
					return value ? String(value).toUpperCase() : '-'
				},
				enableColumnFilter: true,
				enableSorting: true,
				filterFn: 'fuzzy',
				sortingFn: fuzzySort
			}),
			columnHelper.accessor('shoestyle_codefactory', {
				header: t('ns_erp:fields.shoestyle_codefactory'),
				cell: ({ getValue }) => {
					const value = getValue()
					return value ? String(value).toUpperCase() : '-'
				},
				enableColumnFilter: true,
				enableSorting: true,
				filterFn: 'fuzzy',
				sortingFn: fuzzySort
			})
		],
		[i18n.language]
	)

	const { data, isFetching, refetch } = useGetTransferOrderDatalist()
	const { mutateAsync, isPending } = useAddTransferOrderMutation()

	const handleResetRowSelection = useCallback(() => {
		toggleDatalistDialogOpen()
		tableRef.current.resetRowSelection()
	}, [tableRef])

	const handleAddTransferOrders = useCallback(async () => {
		if (!tableRef.current.getIsSomeRowsSelected()) {
			toast.warning('You have to pick some data first !')
			return
		}
		await mutateAsync(tableRef.current.getSelectedRowModel().flatRows.map((item) => item.original))
		handleResetRowSelection()
	}, [tableRef])

	return (
		<Dialog open={datalistDialogOpen} onOpenChange={toggleDatalistDialogOpen}>
			<DialogContent className='w-full max-w-8xl items-stretch'>
				<DialogHeader>
					<DialogTitle>Transfer order datalist</DialogTitle>
					<DialogDescription>Pick the data from the table below to add new transfer orders</DialogDescription>
				</DialogHeader>
				<Separator />
				{/* Transfer order search form */}
				<OrderDatalistSearchForm />
				{/* Transfer order search result table */}
				<DataTable
					ref={tableRef}
					data={data}
					loading={isFetching}
					columns={columns}
					enableColumnFilters={true}
					enableGlobalFilter={false}
					enableRowSelection={true}
					// containerProps={{ className: 'h-80' }}
					toolbarProps={{
						slotRight: () => (
							<Fragment>
								{isSmallScreen && (
									<Tooltip message={t('ns_common:actions.reload')} triggerProps={{ asChild: true }}>
										<Popover>
											<PopoverTrigger asChild={true}>
												<Button variant='outline' size='icon'>
													<Icon name='Search' />
												</Button>
											</PopoverTrigger>
											<PopoverContent>
												<OrderDatalistSearchForm />
											</PopoverContent>
										</Popover>
									</Tooltip>
								)}
								<Tooltip message={t('ns_common:actions.reload')} triggerProps={{ asChild: true }}>
									<Button variant='outline' size='icon' onClick={() => refetch()}>
										<Icon name='RotateCw' />
									</Button>
								</Tooltip>
							</Fragment>
						)
					}}
				/>
				<Separator />
				<DialogFooter className='flex items-center gap-x-0.5'>
					<Button variant='outline' onClick={handleResetRowSelection}>
						{t('ns_common:actions.cancel')}
					</Button>
					<Button onClick={handleAddTransferOrders} disabled={isPending}>
						{t('ns_common:actions.add')}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

export default OrderDatalistDialog
