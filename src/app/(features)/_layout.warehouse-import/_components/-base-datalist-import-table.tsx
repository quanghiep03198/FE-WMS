import { Button, Checkbox, DataTable, DialogFooter, Icon, Separator, Tooltip } from '@/components/ui'
import { useStepContext } from '@/components/ui/@custom/step'
import { ROW_SELECTION_COLUMN_ID } from '@/components/ui/@react-table/constants'
import { fuzzySort } from '@/components/ui/@react-table/utils/fuzzy-sort.util'
import { CheckedState } from '@radix-ui/react-checkbox'
import { Table, createColumnHelper } from '@tanstack/react-table'
import { isEmpty } from 'lodash'
import { Fragment, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetProductionImportDatalistQuery } from '../_apis/use-warehouse-import.api'
import { useDatalistDialogContext } from '../_contexts/-datalist-dialog-context'

const OrderDetailsDatalist: React.FC = () => {
	const { t, i18n } = useTranslation()
	const { data, isLoading, refetch } = useGetProductionImportDatalistQuery()
	const tableRef = useRef<Table<any>>(null)
	const { dispatch } = useStepContext()
	const { setImportOrderDetailValue, selectedOrderDetailRows, setSelectedOrderDetailRows } = useDatalistDialogContext()
	const columnHelper = createColumnHelper()

	const columns = useMemo(
		() => [
			columnHelper.display({
				id: ROW_SELECTION_COLUMN_ID,
				header: ({ table }) => {
					const checked =
						table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
					return (
						<Checkbox
							role='checkbox'
							checked={checked as CheckedState}
							onCheckedChange={(checkedState) => {
								table.toggleAllRowsSelected(Boolean(checkedState))
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
						}}
					/>
				),
				size: 50,
				enableSorting: false,
				enableHiding: false,
				enableResizing: false,
				enablePinning: false
			}),
			columnHelper.accessor('brand_name', {
				id: 'brand_name',
				header: t('ns_erp:fields.brand_name'),
				enableColumnFilter: true,
				enableResizing: true,
				enableSorting: true,
				sortingFn: fuzzySort,
				filterFn: 'fuzzy',
				maxSize: 240
			}),
			columnHelper.accessor('mo_no', {
				id: 'mo_no',
				header: t('ns_erp:fields.mo_no'),
				enableColumnFilter: true,
				enableResizing: true,
				enableSorting: true,
				sortingFn: fuzzySort,
				filterFn: 'fuzzy'
			}),
			columnHelper.accessor('or_no', {
				id: 'or_no',
				header: t('ns_erp:fields.or_no'),
				enableColumnFilter: true,
				enableResizing: true,
				enableSorting: true,
				sortingFn: fuzzySort,
				filterFn: 'fuzzy'
			}),
			columnHelper.accessor('or_custpoone', {
				id: 'or_custpoone',
				header: t('ns_erp:fields.or_custpoone', { defaultValue: 'Customer order code' }),
				enableColumnFilter: true,
				enableResizing: true,
				enableSorting: true,
				sortingFn: fuzzySort,
				filterFn: 'fuzzy'
			}),
			columnHelper.accessor('shoestyle_codefactory', {
				id: 'shoestyle_codefactory',
				header: t('ns_erp:fields.shoestyle_codefactory', { defaultValue: '工廠型體' }),
				enableColumnFilter: true,
				enableResizing: true,
				enableSorting: true,
				sortingFn: fuzzySort,
				filterFn: 'fuzzy'
			}),
			columnHelper.accessor('prod_color', {
				id: 'prod_color',
				header: t('ns_erp:fields.prod_color', { defaultValue: '中英顏色' }),
				enableColumnFilter: true,
				enableResizing: true,
				enableSorting: true,
				sortingFn: fuzzySort,
				filterFn: 'fuzzy'
			}),
			columnHelper.accessor('or_deliverdate', {
				id: 'or_deliverdate',
				header: t('ns_erp:fields.or_deliverdate', { defaultValue: '中英顏色' }),
				enableColumnFilter: true,
				enableResizing: true,
				enableSorting: true,
				sortingFn: fuzzySort,
				filterFn: 'inDateRange',
				meta: { filterVariant: 'date' },
				minSize: 250
			}),
			columnHelper.accessor('or_deliverdate_confirm', {
				id: 'or_deliverdate_confirm',
				header: t('ns_erp:fields.or_deliverdate_confirm', { defaultValue: '中英顏色' }),
				enableColumnFilter: true,
				enableResizing: true,
				enableSorting: true,
				sortingFn: fuzzySort,
				filterFn: 'inDateRange',
				meta: { filterVariant: 'date' },
				minSize: 200
			}),
			columnHelper.accessor('or_totalqty', {
				id: 'or_totalqty',
				header: t('ns_erp:fields.or_totalqty', { defaultValue: '訂單數量' }),
				enableColumnFilter: true,
				enableResizing: true,
				enableSorting: true,
				sortingFn: fuzzySort,
				filterFn: 'inNumberRange',
				meta: { filterVariant: 'range', align: 'right' },
				minSize: 200
			}),
			columnHelper.accessor('sno_qty', {
				id: 'sno_qty',
				header: t('ns_erp:fields.sno_qty', { defaultValue: '已入庫數量' }),
				enableColumnFilter: true,
				enableResizing: true,
				enableSorting: true,
				sortingFn: fuzzySort,
				filterFn: 'inNumberRange',
				meta: { filterVariant: 'range', align: 'right' },
				minSize: 200
			}),
			columnHelper.accessor('sno_qty_notyet', {
				id: 'sno_qty_notyet',
				header: t('ns_erp:fields.sno_qty_notyet', { defaultValue: '未入庫數量' }),
				enableColumnFilter: true,
				enableResizing: true,
				enableSorting: true,
				sortingFn: fuzzySort,
				filterFn: 'inNumberRange',
				meta: { filterVariant: 'range', align: 'right' },
				minSize: 200
			}),
			columnHelper.accessor('dep_name', {
				id: 'dep_name',
				header: t('ns_erp:fields.dep_name', { defaultValue: '港口名稱' }),
				enableColumnFilter: true,
				enableResizing: true,
				enableSorting: true,
				sortingFn: fuzzySort,
				filterFn: 'fuzzy'
			}),
			columnHelper.accessor('dep_destination', {
				id: 'dep_destination',
				header: t('ns_erp:fields.dep_destination', { defaultValue: '日的地' }),
				enableColumnFilter: true,
				enableResizing: true,
				enableSorting: true,
				sortingFn: fuzzySort,
				filterFn: 'fuzzy'
			})
		],
		[i18n.language]
	)

	const handleAddImportOrderDetail = () => {
		try {
			if (tableRef.current) {
				setImportOrderDetailValue(tableRef.current.getSelectedRowModel().flatRows.map((item) => item.original))
				dispatch({ type: 'NEXT_STEP' })
			}
		} catch (e) {
			console.log(e.message)
		}
	}

	return (
		<Fragment>
			<DataTable
				columns={columns}
				data={data}
				loading={isLoading}
				ref={tableRef}
				caption='Production orders datalist'
				enableRowSelection={true}
				containerProps={{ className: 'h-[40vh]' }}
				onRowSelectionChange={setSelectedOrderDetailRows}
				initialState={{ rowSelection: selectedOrderDetailRows }}
				toolbarProps={{
					slotRight: () => (
						<Fragment>
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
			<DialogFooter>
				<Button type='button' variant='outline' onClick={() => dispatch({ type: 'PREV_STEP' })}>
					{t('ns_common:actions.back')}
				</Button>
				<Button
					variant='default'
					type='button'
					disabled={isEmpty(selectedOrderDetailRows)}
					onClick={(e) => {
						e.stopPropagation()
						handleAddImportOrderDetail()
					}}>
					{t('ns_common:actions.proceed')}
				</Button>
			</DialogFooter>
		</Fragment>
	)
}

export default OrderDetailsDatalist
