import { factories } from '@/common/constants/constants'
import useAuth from '@/common/hooks/use-auth'
import useQueryParams from '@/common/hooks/use-query-params'
import { IMonthlyInventoryReport } from '@/common/types/entities'
import formatIntlNumber from '@/common/utils/format-intl-number'
import {
	Button,
	DataTable,
	Div,
	Icon,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	Tooltip
} from '@/components/ui'
import Skeleton from '@/components/ui/@custom/skeleton'
import {
	IndeterminateCheckbox,
	RowSelectionCheckbox
} from '@/components/ui/@react-table/components/row-selection-checkbox'
import { ROW_EXPANSION_COLUMN_ID, ROW_SELECTION_COLUMN_ID } from '@/components/ui/@react-table/constants'
import { useTableContext } from '@/components/ui/@react-table/context/table.context'
import { RenderSubComponentProps } from '@/components/ui/@react-table/types'
import { InventoryService } from '@/services/inventory.service'
import { useQueryClient } from '@tanstack/react-query'
import { createColumnHelper, ExpandedState, type Table as TTable } from '@tanstack/react-table'
import { useResetState } from 'ahooks'
import { format } from 'date-fns'
import { saveAs } from 'file-saver'
import { pick } from 'lodash'
import { Fragment, useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { INVENTORY_REPORT_PROVIDE_TAG, useGetInventoryAuditReport } from '../../-hooks/use-report'
import { useGetTenantByFactory } from '../../-hooks/use-tenacy'
import { InventoryReportDetailTable } from './report-detail-table'

export const InventoryReportMasterTable: React.FC = () => {
	const { searchParams } = useQueryParams<{ 'month.eq': string }>({ 'month.eq': format(new Date(), 'yyyy-MM') })
	const { data: currentTenant } = useGetTenantByFactory()

	const { data, isLoading } = useGetInventoryAuditReport(currentTenant?.id, searchParams)
	const { t, i18n } = useTranslation()
	const dataTableRef = useRef<TTable<IMonthlyInventoryReport>>(null)
	const columnHelper = createColumnHelper<IMonthlyInventoryReport>()
	const [expanded, setExpanded, resetExpanded] = useResetState<ExpandedState>({})

	useEffect(() => {
		if (dataTableRef.current) dataTableRef.current.toggleAllRowsExpanded(false)
	}, [data])

	useEffect(() => {
		resetExpanded()
	}, [searchParams['month.eq']])

	const columns = useMemo(
		() => [
			columnHelper.display({
				id: ROW_SELECTION_COLUMN_ID,
				header: IndeterminateCheckbox,
				cell: RowSelectionCheckbox,
				size: 50,
				enableSorting: false,
				enableHiding: false,
				enableResizing: false,
				enablePinning: false
			}),
			columnHelper.display({
				id: ROW_EXPANSION_COLUMN_ID,
				header: () => (
					<Tooltip message={t('ns_common:actions.fold')} triggerProps={{ asChild: true }}>
						<button
							className='absolute inset-0 flex h-full w-full items-center justify-center text-muted-foreground transition-colors duration-200 hover:text-foreground'
							onClick={() => resetExpanded()}>
							<Icon name='ListCollapse' size={18} />
						</button>
					</Tooltip>
				),
				size: 50,
				maxSize: 50,
				enableResizing: false,
				meta: { align: 'left' },
				cell: ({ row }) => (
					<button
						className='absolute inset-0 flex h-full w-full items-center justify-center'
						onClick={() => setExpanded({ [row.index]: !row.getIsExpanded() })}>
						<Icon name={row.getIsExpanded() ? 'ChevronDown' : 'ChevronRight'} />
					</button>
				)
			}),
			columnHelper.accessor('brand_name', {
				header: t('ns_erp:fields.brand_name'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				minSize: 100,
				filterFn: 'fuzzy',
				meta: { align: 'left' },
				cell: ({ getValue }) => getValue() ?? 'Unknown'
			}),
			columnHelper.accessor('mo_no', {
				header: t('ns_erp:fields.mo_no'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				minSize: 100,
				meta: { align: 'left' },
				filterFn: 'includesString'
			}),
			columnHelper.accessor('shoes_style_code_factory', {
				header: t('ns_erp:fields.shoestyle_codefactory'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				filterFn: 'fuzzy',
				minSize: 100,
				meta: { align: 'left' },
				cell: ({ getValue }) => getValue() ?? 'Unknown'
			}),
			columnHelper.accessor('cust_shoestyle', {
				header: t('ns_erp:fields.cust_shoestyle'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				filterFn: 'fuzzy',
				minSize: 100,
				meta: {
					align: 'left'
				},
				cell: ({ getValue }) => getValue() ?? 'Unknown'
			}),
			columnHelper.accessor('color_sn', {
				header: t('ns_erp:fields.color_sn'),
				enableColumnFilter: true,
				enableSorting: true,
				minSize: 100,
				filterFn: 'fuzzy',
				cell: ({ getValue }) => {
					return getValue() ?? 'Unknown'
				}
			}),
			columnHelper.accessor('order_qty', {
				header: t('ns_erp:fields.mo_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				meta: { filterVariant: 'range', align: 'right' },
				filterFn: 'inNumberRange',
				minSize: 100,

				cell: ({ getValue }) => formatIntlNumber(getValue())
			}),
			columnHelper.accessor('init_inv_qty', {
				header: t('ns_erp:fields.total_init_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				meta: { filterVariant: 'range', align: 'right' },
				filterFn: 'inNumberRange',
				minSize: 100,
				cell: ({ getValue }) => formatIntlNumber(getValue())
			}),
			columnHelper.accessor('total_instock_qty', {
				header: t('ns_erp:fields.inbound_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				meta: { filterVariant: 'range', align: 'right' },
				filterFn: 'inNumberRange',
				minSize: 100,
				cell: ({ getValue }) => formatIntlNumber(getValue())
			}),
			columnHelper.accessor('total_outstock_qty', {
				header: t('ns_erp:fields.outbound_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				meta: { filterVariant: 'range', align: 'right' },
				filterFn: 'inNumberRange',
				minSize: 100,
				cell: ({ getValue }) => formatIntlNumber(getValue())
			}),
			columnHelper.accessor('actual_inv_qty', {
				header: t('ns_erp:fields.actual_inventory_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				meta: { filterVariant: 'range', align: 'right' },
				filterFn: 'inNumberRange',
				minSize: 100,
				cell: ({ getValue }) => formatIntlNumber(getValue())
			}),
			columnHelper.accessor('final_inv_qty', {
				header: t('ns_erp:fields.final_inventory_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				meta: { filterVariant: 'range', align: 'right' },
				filterFn: 'inNumberRange',
				minSize: 100,
				cell: ({ getValue }) => formatIntlNumber(getValue())
			})
		],
		[data, i18n.language]
	)

	return (
		<Div className='relative space-y-10'>
			<DataTable
				ref={dataTableRef}
				columns={columns}
				data={data}
				loading={isLoading}
				expanded={expanded}
				getRowCanExpand={() => true}
				enableRowSelection={true}
				enableExpanding={true}
				manualExpanding={true}
				renderSubComponent={DataDetailTable}
				containerProps={{ className: 'xl:h-[50vh] h-[40vh]' }}
				footerProps={{ slot: () => <DataTableSummary data={data} isLoading={isLoading} /> }}
				toolbarProps={{
					slotRight: () => <DataTableSlotRight downloadable={data?.length > 0} />
				}}
			/>
		</Div>
	)
}

const DataTableSlotRight = ({ downloadable }: { downloadable: boolean }) => {
	const { t } = useTranslation()
	const { table } = useTableContext('table')
	const { searchParams } = useQueryParams<{ 'month.eq': string }>()
	const queryClient = useQueryClient()
	const { user } = useAuth()
	const { data: currentTenant } = useGetTenantByFactory()

	const selectedRows = table.getSelectedRowModel().rows

	const handleDownloadExcel = useCallback(async () => {
		const id = toast.loading(t('ns_common:notification.downloading'))
		try {
			const blob = await InventoryService.downloadInventoryAuditReport(currentTenant?.id, {
				...pick(searchParams, 'month.eq'),
				'mo_no.in': selectedRows.map((row) => row.original.mo_no)
			})
			saveAs(
				blob,
				t('ns_inoutbound:titles.file_monthly_inventory_report', {
					factory: t(factories[user.company_code], { ns: 'ns_common' }),
					month: searchParams['month.eq'],
					defaultValue: `Monthly Inventory Report ~ ${searchParams['month.eq']}`
				}) + '.xlsx'
			)
			toast.success(t('ns_common:notification.success'), { id })
		} catch {
			toast.error('ns_common:notification.error', { id })
		}
	}, [selectedRows])

	return (
		<Fragment>
			<Tooltip message={`${t('ns_common:actions.export')} Excel`} triggerProps={{ asChild: true }}>
				<Button size='icon' variant='outline' disabled={!downloadable} onClick={() => handleDownloadExcel()}>
					<Icon name='Download' />
				</Button>
			</Tooltip>
			<Tooltip message={t('ns_common:actions.reload')} triggerProps={{ asChild: true }}>
				<Button
					size='icon'
					variant='outline'
					onClick={() =>
						queryClient.refetchQueries({
							predicate: (query) => query.queryKey.some((queryKey) => queryKey === INVENTORY_REPORT_PROVIDE_TAG)
						})
					}>
					<Icon name='RotateCw' />
				</Button>
			</Tooltip>
		</Fragment>
	)
}

const DataDetailTable = ({ row }: RenderSubComponentProps<IMonthlyInventoryReport, unknown>) => (
	<InventoryReportDetailTable
		queries={pick(row.original, [
			'actual_po',
			'mo_no',
			'cust_shoestyle',
			'shoes_style_code_factory',
			'inv_type',
			'inv_year_month'
		])}
		data={row.original?.detail}
	/>
)

const DataTableSummary = ({ data, isLoading }: { data: IMonthlyInventoryReport[]; isLoading: boolean }) => {
	const { t } = useTranslation()

	const totalInitialQuantity = Array.isArray(data) ? data.reduce((acc, curr) => acc + curr.init_inv_qty, 0) : 0
	const totalInboundQuantity = Array.isArray(data) ? data.reduce((acc, curr) => acc + curr.total_instock_qty, 0) : 0
	const totalOutboundQuantity = Array.isArray(data) ? data.reduce((acc, curr) => acc + curr.total_outstock_qty, 0) : 0
	const actualInventoryQuantity = Array.isArray(data) ? data.reduce((acc, curr) => acc + curr.actual_inv_qty, 0) : 0
	const finalInventoryQuantity = Array.isArray(data) ? data.reduce((acc, curr) => acc + curr.final_inv_qty, 0) : 0

	return (
		<Table className='w-full table-fixed'>
			<TableHeader>
				<TableRow>
					<TableHead colSpan={5} className='bg-muted text-muted-foreground'>
						{t('ns_common:titles.overall')}
					</TableHead>
				</TableRow>
				<TableRow className='[&_th]:bg-table-head [&_th]:text-table-head-foreground'>
					<TableHead align='right'>{t('ns_erp:fields.total_init_qty')}</TableHead>
					<TableHead align='right'>{t('ns_erp:fields.inbound_qty')}</TableHead>
					<TableHead align='right'>{t('ns_erp:fields.outbound_qty')}</TableHead>
					<TableHead align='right'>{t('ns_erp:fields.actual_inventory_qty')}</TableHead>
					<TableHead align='right'>{t('ns_erp:fields.final_inventory_qty')}</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				<TableRow className='divide-x *:font-medium'>
					<TableCell align='right'>{isLoading ? <Skeleton /> : formatIntlNumber(totalInitialQuantity)}</TableCell>
					<TableCell align='right'>{isLoading ? <Skeleton /> : formatIntlNumber(totalInboundQuantity)}</TableCell>
					<TableCell align='right'>{isLoading ? <Skeleton /> : formatIntlNumber(totalOutboundQuantity)}</TableCell>
					<TableCell align='right'>
						{isLoading ? <Skeleton /> : formatIntlNumber(actualInventoryQuantity)}
					</TableCell>
					<TableCell align='right'>
						{isLoading ? <Skeleton /> : formatIntlNumber(finalInventoryQuantity)}
					</TableCell>
				</TableRow>
			</TableBody>
		</Table>
	)
}

InventoryReportMasterTable.displayName = 'InventoryReportDataTable'
