import { factories } from '@/common/constants/constants'
import { useAuth } from '@/common/hooks/use-auth'
import useQueryParams from '@/common/hooks/use-query-params'
import { IMonthlyInventoryReport } from '@/common/types/entities'
import {
	Button,
	DataTable,
	Div,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
	Icon,
	Label,
	Slider,
	Switch,
	Tooltip,
	Typography
} from '@/components/ui'
import { ROW_EXPANSION_COLUMN_ID } from '@/components/ui/@react-table/constants'
import { RenderSubComponent } from '@/components/ui/@react-table/types'
import { ReportService } from '@/services/report.service'
import { HoverCardPortal } from '@radix-ui/react-hover-card'
import { createColumnHelper, type Table as TTable } from '@tanstack/react-table'
import { useDebounce, useMemoizedFn, usePrevious } from 'ahooks'
import { format } from 'date-fns'
import { saveAs } from 'file-saver'
import { pick, sortBy } from 'lodash'
import { Fragment, memo, useEffect, useId, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useGetMonthlyInventoryReport } from '../../_apis/use-report.api'
import { useGetTenantByFactory } from '../../_apis/use-tenacy.api'
import { InventorySizeTable } from './-inventory-size-detail'

export type UrlQueryParams = {
	'month.eq': string
	'auto-refresh': number | false
}

const DOWNLOAD_INVENTORY_REPORT_ID = 'download-inbound-report'

export const ReportDataList: React.FC = () => {
	const { searchParams } = useQueryParams<UrlQueryParams>({
		'month.eq': format(new Date(), 'yyyy-MM'),
		'auto-refresh': false
	})
	const { user } = useAuth()
	const { data: tenants } = useGetTenantByFactory()
	const currentTenant = useMemo(() => {
		if (Array.isArray(tenants) && tenants.length > 0) {
			return tenants.find((item) => item.factories.join('') === user.company_code)
		} else {
			return null
		}
	}, [tenants, user.company_code])

	const { data, isLoading, refetch } = useGetMonthlyInventoryReport(currentTenant?.id, searchParams)
	const { t, i18n } = useTranslation()
	const dataTableRef = useRef<TTable<IMonthlyInventoryReport>>(null)
	const columnHelper = createColumnHelper<IMonthlyInventoryReport>()

	useEffect(() => {
		if (dataTableRef.current) dataTableRef.current.toggleAllRowsExpanded(false)
	}, [data])

	const columns = useMemo(
		() => [
			columnHelper.display({
				id: ROW_EXPANSION_COLUMN_ID,
				header: ({ table }) => (
					<Tooltip message={t('ns_common:actions.fold')} triggerProps={{ asChild: true }}>
						<button
							className='absolute inset-0 flex h-full w-full items-center justify-center'
							onClick={() => table.toggleAllRowsExpanded(false)}>
							<Icon name='FoldVertical' stroke='hsl(var(--foreground))' />
						</button>
					</Tooltip>
				),
				size: 50,
				enableResizing: false,
				cell: ({ row, table }) => (
					<button
						className='absolute inset-0 flex h-full w-full items-center justify-center'
						onClick={() => {
							table.toggleAllRowsExpanded(false)
							row.toggleExpanded(!row.getIsExpanded())
						}}>
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
				filterFn: 'fuzzy'
			}),
			columnHelper.accessor('mo_no', {
				header: t('ns_erp:fields.mo_no'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				minSize: 150,
				filterFn: 'fuzzy'
			}),
			columnHelper.accessor('shoes_style_code_factory', {
				header: t('ns_erp:fields.shoestyle_codefactory'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				filterFn: 'fuzzy',
				minSize: 200,
				cell: ({ getValue }) => getValue() ?? 'Unknown'
			}),
			columnHelper.accessor('order_qty', {
				header: t('ns_erp:fields.order_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				filterFn: 'fuzzy',
				minSize: 200,
				cell: ({ getValue }) => getValue() ?? 'Unknown'
			}),
			columnHelper.accessor('init_inv_qty', {
				header: t('ns_erp:fields.total_init_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				filterFn: 'fuzzy',
				minSize: 200,
				cell: ({ getValue }) => getValue() ?? 'Unknown'
			}),
			columnHelper.accessor('total_instock_qty', {
				header: t('ns_erp:fields.inbound_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				filterFn: 'fuzzy',
				minSize: 200,
				cell: ({ getValue }) => getValue() ?? 'Unknown'
			}),
			columnHelper.accessor('total_outstock_qty', {
				header: t('ns_erp:fields.outbound_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				filterFn: 'fuzzy',
				minSize: 200,
				cell: ({ getValue }) => getValue() ?? 'Unknown'
			}),
			columnHelper.accessor('actual_inv_qty', {
				header: t('ns_erp:fields.actual_inventory_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				filterFn: 'fuzzy',
				minSize: 200,
				cell: ({ getValue }) => getValue() ?? 'Unknown'
			}),
			columnHelper.accessor('final_inv_qty', {
				header: t('ns_erp:fields.final_inventory_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				filterFn: 'fuzzy',
				minSize: 200,
				cell: ({ getValue }) => getValue() ?? 'Unknown'
			})
		],
		[i18n.language]
	)

	const handleDownloadExcel = useMemoizedFn(async () => {
		toast.loading(t('ns_common:notification.downloading'), { id: DOWNLOAD_INVENTORY_REPORT_ID })
		try {
			const blob = await ReportService.downloadInventoryReport(currentTenant?.id, pick(searchParams, 'month.eq'))
			saveAs(
				blob,
				t('ns_inoutbound:titles.file_monthly_inventory_report', {
					factory: t(factories[user.company_code], { ns: 'ns_common' }),
					month: searchParams['month.eq'],
					defaultValue: `Inbound Report ~ ${searchParams['month.eq']}`
				}) + '.xlsx'
			)
			toast.success(t('ns_common:notification.success'), { id: DOWNLOAD_INVENTORY_REPORT_ID })
		} catch {
			toast.error('ns_common:notification.error', { id: DOWNLOAD_INVENTORY_REPORT_ID })
		}
	})

	return (
		<Div className='relative space-y-10'>
			<AutoRefreshToggle />
			<DataTable
				columns={columns}
				data={data}
				loading={isLoading}
				containerProps={{
					style: { height: screen.availHeight / 1.75 }
				}}
				renderSubComponent={
					(({ row }) => {
						return <InventorySizeTable data={sortBy(row.original?.size_data, 'size_numcode')} />
					}) satisfies RenderSubComponent<IMonthlyInventoryReport>
				}
				toolbarProps={{
					slotRight: () => (
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
					)
				}}
			/>
		</Div>
	)
}

ReportDataList.displayName = 'InventoryReportDataTable'

const AutoRefreshToggle: React.FC = memo(() => {
	const { t } = useTranslation()
	const id = useId()
	const { searchParams, setParams } = useQueryParams<UrlQueryParams>()
	const [refetchInterval, setRefetchInterval] = useState<number | false>(searchParams['auto-refresh'])
	const previousRefetchInterval = usePrevious<number | false>(refetchInterval)

	const debouncedValue = useDebounce(refetchInterval, { wait: 1000 })

	useEffect(() => {
		setParams({ ...searchParams, 'auto-refresh': debouncedValue })
	}, [debouncedValue])

	return (
		<HoverCard>
			<HoverCardTrigger className='absolute inline-flex items-center justify-center gap-x-3 rounded-md bg-accent/60 px-4 py-2 shadow'>
				<Label htmlFor={id}>{t('ns_common:table.auto_refresh')}</Label>
				<Switch
					id={id}
					checked={Boolean(refetchInterval)}
					onCheckedChange={(checked) => {
						if (checked) setRefetchInterval(previousRefetchInterval ?? 5000)
						else setRefetchInterval(false)
					}}
				/>
			</HoverCardTrigger>
			<HoverCardPortal>
				<HoverCardContent hidden={!refetchInterval} side='right' sideOffset={8} className='w-80'>
					<Div className='space-y-4'>
						<Typography variant='small'>{t('ns_common:table.refetch_interval')}</Typography>
						<Div className='flex items-start justify-between gap-2'>
							<Icon name='Zap' size={20} className='-translate-y-2' />
							<Div className='flex-1 basis-full space-y-3'>
								<Slider
									min={5000}
									max={30000}
									step={5000}
									value={
										typeof refetchInterval === 'number'
											? [refetchInterval]
											: [previousRefetchInterval || 5000]
									}
									onValueChange={([value]) => setRefetchInterval(value)}
								/>
								<Div className='flex items-baseline justify-between'>
									{Array.from({ length: 6 }, (_, i) => (
										<Typography key={i} variant='small' className='text-center !text-[10px]'>
											{(i + 1) * 5}
										</Typography>
									))}
								</Div>
							</Div>
							<Icon name='Leaf' size={20} className='-translate-y-2' />
						</Div>
					</Div>
				</HoverCardContent>
			</HoverCardPortal>
		</HoverCard>
	)
})

AutoRefreshToggle.displayName = 'AutoRefreshToggle'
