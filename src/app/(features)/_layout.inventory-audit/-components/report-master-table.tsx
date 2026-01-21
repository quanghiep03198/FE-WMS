import { factories } from '@/common/constants/constants'
import useAuth from '@/common/hooks/use-auth'
import useQueryParams from '@/common/hooks/use-query-params'
import { IMonthlyInventoryAudit } from '@/common/types/entities'
import formatIntlNumber from '@/common/utils/format-intl-number'
import { Badge, Button, DataTable, Div, Icon, Tooltip, Typography } from '@/components/ui'
import EllipsisList from '@/components/ui/@custom/ellipsis-list'
import {
	IndeterminateCheckbox,
	RowSelectionCheckbox
} from '@/components/ui/@react-table/components/row-selection-checkbox'
import TableCellText from '@/components/ui/@react-table/components/table-cell-text'
import { ROW_EXPANSION_COLUMN_ID, ROW_SELECTION_COLUMN_ID } from '@/components/ui/@react-table/constants'
import { useTableContext } from '@/components/ui/@react-table/context/table.context'
import { RenderSubComponentProps } from '@/components/ui/@react-table/types'
import { InventoryService } from '@/services/inventory.service'
import { useQueryClient } from '@tanstack/react-query'
import { createColumnHelper, ExpandedState, type Table as TTable } from '@tanstack/react-table'
import { useResetState } from 'ahooks'
import { format } from 'date-fns'
import { saveAs } from 'file-saver'
import { pick, split } from 'lodash-es'
import { Fragment, useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { InventoryAuditQueryKeys, useGetInventoryAuditReport } from '../-hooks/use-inventory-audit-asm'
import { useGetTenantByFactory } from '../../-hooks/use-tenacy-asm'
import { InventoryReportDetailTable } from './report-detail-table'
import DataTableSummary from './report-summary-table'
import SyncDataTrigger from './sync-data-trigger'

export const InventoryReportMasterTable: React.FC = () => {
	const { searchParams } = useQueryParams<{ 'month.eq': string }>({ 'month.eq': format(new Date(), 'yyyy-MM') })
	const { data: currentTenant } = useGetTenantByFactory()

	const { data, isLoading } = useGetInventoryAuditReport(currentTenant?.id, searchParams)
	const { t, i18n } = useTranslation()
	const dataTableRef = useRef<TTable<IMonthlyInventoryAudit>>(null)
	const columnHelper = createColumnHelper<IMonthlyInventoryAudit>()
	const [expanded, setExpanded, resetExpanded] = useResetState<ExpandedState>({})

	useEffect(() => {
		if (dataTableRef.current) dataTableRef.current.toggleAllRowsExpanded(false)
	}, [data])

	useEffect(() => {
		resetExpanded()
	}, [searchParams['month.eq']])

	const renderSubComponents = useCallback(
		({
			row
		}: RenderSubComponentProps<
			IMonthlyInventoryAudit,
			IMonthlyInventoryAudit[keyof IMonthlyInventoryAudit]
		>): React.ReactElement => (
			<InventoryReportDetailTable
				queries={pick(row.original, [
					'actual_po',
					'mo_no',
					'cust_shoes_style',
					'factory_shoes_style',
					'inv_type',
					'inv_year_month'
				])}
				data={row.original?.detail}
			/>
		),
		[]
	)

	const columns = useMemo(
		() => [
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
						onClick={() => setExpanded({ [row.original.mo_no]: !row.getIsExpanded() })}>
						<Icon name={row.getIsExpanded() ? 'ChevronDown' : 'ChevronRight'} />
					</button>
				)
			}),
			columnHelper.display({
				id: ROW_SELECTION_COLUMN_ID,
				header: (props) => <IndeterminateCheckbox {...props} />,
				cell: (props) => <RowSelectionCheckbox {...props} />,
				size: 50,
				maxSize: 50,
				enableSorting: false,
				enableHiding: false,
				enableResizing: false,
				enablePinning: false
			}),
			columnHelper.accessor('brand_name', {
				header: t('ns_erp:fields.brand_name'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableResizing: true,
				filterFn: 'fuzzy',
				meta: { align: 'left' },
				cell: TableCellText
			}),
			columnHelper.accessor('mo_no', {
				header: t('ns_erp:fields.mo_no'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableResizing: true,
				meta: { align: 'left' },
				filterFn: 'includesString',
				cell: TableCellText
			}),
			columnHelper.accessor('factory_shoes_style', {
				header: t('ns_erp:fields.factory_shoes_style'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableResizing: true,
				filterFn: 'fuzzy',
				meta: { align: 'left' },
				cell: TableCellText
			}),
			columnHelper.accessor('cust_shoes_style', {
				header: t('ns_erp:fields.cust_shoes_style'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableResizing: true,
				filterFn: 'fuzzy',
				meta: { align: 'left' },
				cell: TableCellText
			}),
			columnHelper.accessor('color_sn', {
				header: t('ns_erp:fields.color_sn'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableResizing: true,
				filterFn: 'fuzzy',
				cell: TableCellText
			}),
			columnHelper.accessor('storage', {
				header: t('ns_warehouse:fields.storage_name'),
				enableColumnFilter: true,
				enableSorting: true,
				enableResizing: false,
				size: 260,
				filterFn: 'fuzzy',
				cell: ({ getValue }) => {
					const value = getValue()
					if (!value)
						return (
							<Typography variant='small' color='muted'>
								{t('ns_common:titles.unknown')}
							</Typography>
						)
					return (
						<EllipsisList
							threshhold={2}
							data={split(value, ',')
								.filter((item) => !!item)
								.sort((a, b) => a.localeCompare(b))}
							template={({ data }) => (
								<Badge variant='secondary' className='whitespace-nowrap'>
									{data.trim()}
								</Badge>
							)}
						/>
					)
				}
			}),
			columnHelper.accessor('order_qty', {
				header: t('ns_erp:fields.mo_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableResizing: true,
				meta: { filterVariant: 'range', align: 'right' },
				filterFn: 'inNumberRange',

				cell: ({ getValue }) => formatIntlNumber(getValue())
			}),
			columnHelper.accessor('init_inv_qty', {
				header: t('ns_erp:fields.total_init_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableResizing: true,
				meta: { filterVariant: 'range', align: 'right' },
				filterFn: 'inNumberRange',
				cell: ({ getValue }) => formatIntlNumber(getValue())
			}),
			columnHelper.accessor('total_instock_qty', {
				header: t('ns_erp:fields.inbound_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableResizing: true,
				meta: { filterVariant: 'range', align: 'right' },
				filterFn: 'inNumberRange',
				cell: ({ getValue }) => formatIntlNumber(getValue())
			}),
			columnHelper.accessor('total_outstock_qty', {
				header: t('ns_erp:fields.outbound_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableResizing: true,
				meta: { filterVariant: 'range', align: 'right' },
				filterFn: 'inNumberRange',
				cell: ({ getValue }) => formatIntlNumber(getValue())
			}),
			columnHelper.accessor('actual_inv_qty', {
				header: t('ns_erp:fields.actual_inventory_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableResizing: true,
				meta: { filterVariant: 'range', align: 'right' },
				filterFn: 'inNumberRange',
				cell: ({ getValue }) => formatIntlNumber(getValue())
			}),
			columnHelper.accessor('final_inv_qty', {
				header: t('ns_erp:fields.final_inventory_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableResizing: true,
				meta: { filterVariant: 'range', align: 'right' },
				filterFn: 'inNumberRange',
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
				initialState={{
					pagination: {
						pageIndex: 0,
						pageSize: 50
					}
				}}
				data={data}
				loading={isLoading}
				expanded={expanded}
				getRowCanExpand={() => true}
				enableRowSelection={true}
				enableExpanding={true}
				enableColumnResizing={true}
				manualExpanding={true}
				renderSubComponent={renderSubComponents}
				getRowId={(originalRow: IMonthlyInventoryAudit) => originalRow.mo_no}
				containerProps={{
					className: 'h-[60dvh]'
				}}
				footerProps={{ slot: () => <DataTableSummary data={data} isLoading={isLoading} /> }}
				toolbarProps={{
					slotLeft: () => <SyncDataTrigger />,
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
					factory: t(factories[user?.current_factory_code], { ns: 'ns_common' }),
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
							predicate: (query) =>
								query.queryKey.some((queryKey) => queryKey === InventoryAuditQueryKeys.INVENTORY_AUDIT)
						})
					}>
					<Icon name='RotateCw' />
				</Button>
			</Tooltip>
		</Fragment>
	)
}

InventoryReportMasterTable.displayName = 'InventoryReportDataTable'
