import { useAuth } from '@/common/hooks/use-auth'
import useQueryParams from '@/common/hooks/use-query-params'
import { IInboundReport } from '@/common/types/entities'
import {
	Badge,
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
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	Tooltip,
	Typography
} from '@/components/ui'
import { ReportService } from '@/services/report.service'
import { createColumnHelper, Table as TTable } from '@tanstack/react-table'
import { saveAs } from 'file-saver'
import { Fragment, memo, useEffect, useId, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useGetTenantByFactory } from '../../_apis/use-tenacy.api'

import { useGetInboundReport } from '@/app/(features)/_apis/use-report.api'
import { factories } from '@/common/constants/constants'
import { ROW_EXPANSION_COLUMN_ID } from '@/components/ui/@react-table/constants'
import { RenderSubComponent } from '@/components/ui/@react-table/types'
import { HoverCardPortal } from '@radix-ui/react-hover-card'
import { useDebounce, useMemoizedFn, usePrevious } from 'ahooks'
import { format } from 'date-fns'
import { isNil } from 'lodash'

export type UrlQueryParams = {
	'date.eq': string
	'auto-refresh': number | false
}

const DOWNLOAD_INBOUND_REPORT_ID = 'download-inbound-report'

const ReportDatalist: React.FC = () => {
	const { searchParams } = useQueryParams<UrlQueryParams>({
		'date.eq': format(new Date(), 'yyyy-MM-dd'),
		'auto-refresh': false
	})
	const { data: tenants } = useGetTenantByFactory()
	const { user } = useAuth()
	const currentTenant = useMemo(() => {
		if (Array.isArray(tenants) && tenants.length > 0) {
			return tenants.find((item) => item.factories.join('') === user.company_code)
		} else {
			return null
		}
	}, [tenants, user.company_code])

	const { data, isLoading, refetch } = useGetInboundReport(currentTenant?.id, searchParams)
	const { t, i18n } = useTranslation()
	const dataTableRef = useRef<TTable<IInboundReport>>(null)
	const columnHelper = createColumnHelper<IInboundReport>()

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
			columnHelper.accessor('factory_code', {
				header: t('ns_common:common_fields.factory_code'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				minSize: 150,
				size: 150,
				meta: {
					filterVariant: 'select',
					facetedUniqueValues: Object.entries(factories).map(([key, val]) => ({
						label: t(val, { ns: 'ns_common', defaultValue: val }),
						value: key
					}))
				},
				cell: ({ getValue }) => {
					const factoryCode = getValue()
					return factoryCode
						? t(factories[factoryCode], { ns: 'ns_common', defaultValue: factoryCode })
						: 'Unknown'
				}
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
				filterFn: 'fuzzy',
				minSize: 200,
				cell: ({ getValue }) => getValue() ?? 'Unknown'
			}),
			columnHelper.accessor('mat_ecolor', {
				header: t('ns_erp:fields.mat_ecolor'),
				enableColumnFilter: true,
				enableSorting: true,
				minSize: 200,
				filterFn: 'fuzzy',
				cell: ({ getValue }) => {
					return getValue() ?? 'Unknown'
				}
			}),
			columnHelper.accessor('shaping_dept_name', {
				header: t('ns_erp:fields.shaping_dept_name'),
				enableColumnFilter: true,
				enableSorting: true,
				minSize: 200,
				filterFn: 'includesString',
				cell: ({ getValue }) => {
					const value = getValue()
					return (
						<Div className='space-x-1'>
							{value
								.split(',')
								.sort((a, b) => a.localeCompare(b))
								.map((item) => (
									<Badge key={item} variant='outline' className='font-normal'>
										{item}
									</Badge>
								))}
						</Div>
					)
				}
			}),
			columnHelper.accessor('storage', {
				header: t('ns_warehouse:fields.storage_name'),
				enableColumnFilter: true,
				enableSorting: true,
				minSize: 200,
				filterFn: 'fuzzy',
				cell: ({ getValue }) => {
					const value = getValue()
					return (
						<Div className='space-x-1'>
							{value
								.split(',')
								.sort((a, b) => a.localeCompare(b))
								.map((item) => (
									<Badge key={item} variant='secondary'>
										{item.trim()}
									</Badge>
								))}
						</Div>
					)
				}
			}),
			columnHelper.accessor('order_qty', {
				header: t('ns_erp:fields.order_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				meta: { filterVariant: 'range', align: 'right' },
				filterFn: 'inNumberRange',
				cell: ({ getValue }) => new Intl.NumberFormat().format(getValue()),
				minSize: 220
			}),
			columnHelper.accessor('daily_inbound_qty', {
				header: t('ns_erp:fields.daily_inbound_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				meta: { filterVariant: 'range', align: 'right' },
				filterFn: 'inNumberRange',
				cell: ({ getValue }) => new Intl.NumberFormat().format(getValue()),
				minSize: 275
			}),
			columnHelper.accessor('accumulated_qty', {
				header: t('ns_erp:fields.accumulated_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				meta: { filterVariant: 'range', align: 'right' },
				filterFn: 'inNumberRange',
				cell: ({ getValue }) => new Intl.NumberFormat().format(getValue()),
				minSize: 200
			}),
			columnHelper.display({
				id: 'missing_qty',
				header: t('ns_erp:fields.missing_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				meta: { filterVariant: 'range', align: 'right' },
				filterFn: 'inNumberRange',
				cell: ({ row }) => {
					const { order_qty, accumulated_qty } = row.original
					return !isNil(order_qty) && order_qty >= 0
						? new Intl.NumberFormat().format(order_qty - accumulated_qty)
						: 0
				},
				minSize: 200
			})
		],
		[i18n.language]
	)

	const handleDownloadExcel = useMemoizedFn(async () => {
		toast.loading(t('ns_common:notification.downloading'), { id: DOWNLOAD_INBOUND_REPORT_ID })
		try {
			const blob = await ReportService.downloadInboundReport(currentTenant?.id, searchParams)
			saveAs(
				blob,
				t('ns_inoutbound:titles.file_daily_inbound_report', {
					factory: t(factories[user.company_code], { ns: 'ns_common' }),
					date: searchParams['date.eq'],
					defaultValue: `Inbound Report ~ ${searchParams['date.eq']}`
				}) + '.xlsx'
			)
			toast.success(t('ns_common:notification.success'), { id: DOWNLOAD_INBOUND_REPORT_ID })
		} catch {
			toast.error('ns_common:notification.error', { id: DOWNLOAD_INBOUND_REPORT_ID })
		}
	})

	return (
		<Div className='relative'>
			<AutoRefreshToggle />
			<DataTable
				columns={columns}
				data={data}
				loading={isLoading}
				enableExpanding={true}
				ref={dataTableRef}
				containerProps={{ className: 'h-[65vh]' }}
				renderSubComponent={
					(({ row }) => {
						return <InboundReportDetailTable data={row.original?.size_run} />
					}) satisfies RenderSubComponent<IInboundReport>
				}
				toolbarProps={{
					slotRight: () => (
						<Fragment>
							<Tooltip message={`${t('ns_common:actions.export')} Excel`} triggerProps={{ asChild: true }}>
								<Button
									size='icon'
									variant='outline'
									disabled={!data || data.length === 0}
									onClick={handleDownloadExcel}>
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

const InboundReportDetailTable: React.FC<{ data: IInboundReport['size_run'] }> = ({ data }) => {
	const { t } = useTranslation()
	return (
		<Div className='right-0 top-0 w-96 overflow-clip rounded-md border'>
			<Table className='table-fixed !border-none'>
				<TableHeader>
					<TableRow>
						<TableHead>Size</TableHead>
						<TableHead>{t('ns_erp:fields.inbound_qty')}</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{Array.isArray(data) && data.length > 0 ? (
						data.map((item) => (
							<TableRow key={item.size_numcode}>
								<TableCell align='center' className='font-medium'>
									{item.size_numcode}
								</TableCell>
								<TableCell align='center' key={item.qty}>
									{item.qty}
								</TableCell>
								{data.length === 0 && <TableCell></TableCell>}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell align='center' colSpan={2} className='font-medium'>
								{t('ns_common:table.no_data')}
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</Div>
	)
}

InboundReportDetailTable.displayName = 'InboundReportDetailTable'

export default ReportDatalist
