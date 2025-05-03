import { factories } from '@/common/constants/constants'
import useAuth from '@/common/hooks/use-auth'
import useQueryParams from '@/common/hooks/use-query-params'
import { IMonthlyInventoryReport } from '@/common/types/entities'
import formatIntlNumber from '@/common/utils/format-intl-number'
import { Badge, Button, DataTable, Div, Icon, Tooltip } from '@/components/ui'
import EllipsisList from '@/components/ui/@custom/ellipsis-list'
import { ROW_EXPANSION_COLUMN_ID } from '@/components/ui/@react-table/constants'
import { RenderSubComponent, RenderSubComponentProps } from '@/components/ui/@react-table/types'
import { fuzzySort } from '@/components/ui/@react-table/utils/fuzzy-sort.util'
import { ReportService } from '@/services/report.service'
import { createColumnHelper, ExpandedState, type Table as TTable } from '@tanstack/react-table'
import { useMemoizedFn, useResetState } from 'ahooks'
import { format } from 'date-fns'
import { saveAs } from 'file-saver'
import { has, isEmpty, isNil, pick, sortBy, sortedUniq } from 'lodash'
import { Fragment, useCallback, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useGetMonthlyInventoryReport } from '../../_apis/use-report.api'
import { useGetTenantByFactory } from '../../_apis/use-tenacy.api'
import AutoRefreshToggle from '../../_components/_shared/-auto-refresh-toggle'
import { InventoryReportDetailTable } from './-report-detail-table'

export type UrlQueryParams = {
	'month.eq': string
	'auto-refresh': number | false
}

export const InventoryReportMasterTable: React.FC = () => {
	const { searchParams } = useQueryParams<UrlQueryParams>({
		'month.eq': format(new Date(), 'yyyy-MM'),
		'auto-refresh': false
	})
	const { data: currentTenant } = useGetTenantByFactory()
	const { user } = useAuth()

	const { data, isLoading, refetch } = useGetMonthlyInventoryReport(currentTenant?.id, searchParams)
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

	const facetedUniqPurchaseOrder = useMemo<Record<'label' | 'value', string>[]>(() => {
		if (!Array.isArray(data) || !data.every((item) => has(item, 'po'))) return []
		return sortedUniq(
			data.filter((item) => !isNil(item.po) && !isEmpty(item.po)).flatMap((item) => item?.po?.split(','))
		).map((item) => ({
			label: item,
			value: item
		}))
	}, [data])

	const columns = useMemo(
		() => [
			columnHelper.display({
				id: ROW_EXPANSION_COLUMN_ID,
				header: () => (
					<Tooltip message={t('ns_common:actions.fold')} triggerProps={{ asChild: true }}>
						<button
							className='absolute inset-0 flex h-full w-full items-center justify-center'
							onClick={() => resetExpanded()}>
							<Icon name='FoldVertical' stroke='hsl(var(--foreground))' />
						</button>
					</Tooltip>
				),
				size: 50,
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
				minSize: 150,
				filterFn: 'fuzzy',
				meta: { align: 'left' },
				cell: ({ getValue }) => getValue() ?? 'Unknown'
			}),
			columnHelper.accessor('po', {
				header: 'PO',
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				sortUndefined: 'last',
				sortingFn: fuzzySort,
				enableGlobalFilter: false,
				size: 250,
				minSize: 200,
				meta: {
					align: 'left',
					filterVariant: 'multi-select',
					facetedUniqueValues: facetedUniqPurchaseOrder
				},
				filterFn: 'arrIncludesAll',
				cell: ({ getValue }) => {
					const value = getValue()
					if (!value)
						return (
							<Badge variant='outline' className='whitespace-nowrap'>
								Unknown
							</Badge>
						)
					return (
						<EllipsisList
							threshhold={2}
							data={value.split(',').sort((a, b) => a.localeCompare(b))}
							template={({ data }) => (
								<Badge variant='outline' className='whitespace-nowrap'>
									{data.trim()}
								</Badge>
							)}
						/>
					)
				}
			}),
			columnHelper.accessor('mo_no', {
				header: t('ns_erp:fields.mo_no'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				minSize: 150,
				meta: { align: 'left' },
				filterFn: 'fuzzy'
			}),
			columnHelper.accessor('shoes_style_code_factory', {
				header: t('ns_erp:fields.shoestyle_codefactory'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				filterFn: 'fuzzy',
				minSize: 200,
				meta: { align: 'left' },
				cell: ({ getValue }) => getValue() ?? 'Unknown'
			}),
			columnHelper.accessor('cust_shoestyle', {
				header: t('ns_erp:fields.cust_shoestyle'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				filterFn: 'fuzzy',
				minSize: 200,
				meta: {
					align: 'left'
				},
				cell: ({ getValue }) => getValue() ?? 'Unknown'
			}),
			columnHelper.accessor('order_qty', {
				header: t('ns_erp:fields.mo_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				meta: { filterVariant: 'range', align: 'right' },
				filterFn: 'inNumberRange',
				minSize: 200,

				cell: ({ getValue }) => formatIntlNumber(getValue())
			}),
			columnHelper.accessor('init_inv_qty', {
				header: t('ns_erp:fields.total_init_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				meta: { filterVariant: 'range', align: 'right' },
				filterFn: 'inNumberRange',
				minSize: 200,
				cell: ({ getValue }) => formatIntlNumber(getValue())
			}),
			columnHelper.accessor('total_instock_qty', {
				header: t('ns_erp:fields.inbound_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				meta: { filterVariant: 'range', align: 'right' },
				filterFn: 'inNumberRange',
				minSize: 200,
				cell: ({ getValue }) => formatIntlNumber(getValue())
			}),
			columnHelper.accessor('total_outstock_qty', {
				header: t('ns_erp:fields.outbound_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				meta: { filterVariant: 'range', align: 'right' },
				filterFn: 'inNumberRange',
				minSize: 200,
				cell: ({ getValue }) => formatIntlNumber(getValue())
			}),
			columnHelper.accessor('actual_inv_qty', {
				header: t('ns_erp:fields.actual_inventory_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				meta: { filterVariant: 'range', align: 'right' },
				filterFn: 'inNumberRange',
				minSize: 200,
				cell: ({ getValue }) => formatIntlNumber(getValue())
			}),
			columnHelper.accessor('final_inv_qty', {
				header: t('ns_erp:fields.final_inventory_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				meta: { filterVariant: 'range', align: 'right' },
				filterFn: 'inNumberRange',
				minSize: 200,
				cell: ({ getValue }) => formatIntlNumber(getValue())
			})
		],
		[data, i18n.language]
	)

	const handleDownloadExcel = useMemoizedFn(async () => {
		const id = toast.loading(t('ns_common:notification.downloading'))
		try {
			const blob = await ReportService.downloadInventoryReport(currentTenant?.id, pick(searchParams, 'month.eq'))
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
	})

	const renderDetailTable = useCallback(
		({ row }: RenderSubComponentProps<IMonthlyInventoryReport, unknown>) => (
			<InventoryReportDetailTable
				queries={pick(row.original, [
					'mo_no',
					'cust_shoestyle',
					'shoes_style_code_factory',
					'inv_type',
					'inv_year_month'
				])}
				data={sortBy(row.original?.size_data, 'size_numcode')}
			/>
		),
		[data]
	)

	const renderSlotRight = useMemoizedFn(() => (
		<Fragment>
			<Tooltip message={`${t('ns_common:actions.export')} Excel`} triggerProps={{ asChild: true }}>
				<Button
					size='icon'
					variant='outline'
					disabled={!data || data.length === 0}
					onClick={() => handleDownloadExcel()}>
					<Icon name='Download' />
				</Button>
			</Tooltip>
			<Tooltip message={t('ns_common:actions.reload')} triggerProps={{ asChild: true }}>
				<Button size='icon' variant='outline' onClick={() => refetch()}>
					<Icon name='RotateCw' />
				</Button>
			</Tooltip>
		</Fragment>
	))

	return (
		<Div className='relative space-y-10'>
			<Div className='absolute left-0 top-0'>
				<AutoRefreshToggle />
			</Div>
			<DataTable
				ref={dataTableRef}
				columns={columns}
				data={data}
				loading={isLoading}
				expanded={expanded}
				getRowCanExpand={() => true}
				enableExpanding={true}
				manualExpanding={true}
				renderSubComponent={renderDetailTable satisfies RenderSubComponent<IMonthlyInventoryReport>}
				toolbarProps={{
					slotRight: renderSlotRight
				}}
			/>
		</Div>
	)
}

InventoryReportMasterTable.displayName = 'InventoryReportDataTable'
