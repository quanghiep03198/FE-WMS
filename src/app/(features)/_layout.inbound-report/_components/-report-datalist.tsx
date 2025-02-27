import { PresetBreakPoints } from '@/common/constants/enums'
import { useAuth } from '@/common/hooks/use-auth'
import useMediaQuery from '@/common/hooks/use-media-query'
import useQueryParams from '@/common/hooks/use-query-params'
import { IInboundReport } from '@/common/types/entities'
import {
	Badge,
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
import { ReportService } from '@/services/report.service'
import { createColumnHelper, Table as TTable } from '@tanstack/react-table'
import { saveAs } from 'file-saver'
import { Fragment, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useGetTenantByFactory } from '../../_apis/use-tenacy.api'

import { useGetInboundReport } from '@/app/(features)/_apis/use-report.api'
import { factories } from '@/common/constants/constants'
import { ROW_EXPANSION_COLUMN_ID } from '@/components/ui/@react-table/constants'
import { RenderSubComponent } from '@/components/ui/@react-table/types'
import { capitalize, isNil } from 'lodash'
import DatePickerFilter from './-date-picker-filter'

const DOWNLOAD_INBOUND_REPORT_ID = 'download-inbound-report'

const ReportDatalist: React.FC = () => {
	const { searchParams } = useQueryParams<{ 'date.eq': string }>()
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
	const isSmallScreen = useMediaQuery(PresetBreakPoints.SMALL)
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
				minSize: 150,
				meta: {
					filterVariant: 'select'
				}
			}),
			columnHelper.accessor('mat_code', {
				header: t('ns_erp:fields.mat_code'),
				enableColumnFilter: true,
				enableSorting: true,
				minSize: 150,
				cell: ({ getValue }) => getValue() ?? 'Unknown'
			}),
			columnHelper.accessor('shoes_style_code_factory', {
				header: t('ns_erp:fields.shoestyle_codefactory'),
				enableColumnFilter: true,
				enableSorting: true,
				cell: ({ getValue }) => getValue() ?? 'Unknown',
				minSize: 200
			}),
			columnHelper.accessor('mat_ecolor', {
				header: t('ns_erp:fields.mat_ecolor'),
				enableColumnFilter: true,
				enableSorting: true,
				cell: ({ getValue }) => {
					const value = getValue()
					if (value) return capitalize(value)
					return 'Unknown'
				},
				minSize: 200
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
							{value.split(',').map((item) => (
								<Badge key={item} variant='outline'>
									{item}
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
				meta: { filterVariant: 'range', align: 'right' },
				filterFn: 'inNumberRange',
				cell: ({ getValue }) => new Intl.NumberFormat().format(getValue()),
				minSize: 275
			}),
			columnHelper.accessor('accumulated_inbound_qty', {
				header: t('ns_erp:fields.accumulated_inbound_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				meta: { filterVariant: 'range', align: 'right' },
				filterFn: 'inNumberRange',
				cell: ({ getValue }) => new Intl.NumberFormat().format(getValue()),
				minSize: 250
			}),
			columnHelper.display({
				id: 'missing_qty',
				header: t('ns_erp:fields.missing_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				meta: { filterVariant: 'range', align: 'right' },
				filterFn: 'inNumberRange',
				cell: ({ row }) => {
					const { order_qty, accumulated_inbound_qty } = row.original
					return !isNil(order_qty) && order_qty >= 0
						? new Intl.NumberFormat().format(order_qty - accumulated_inbound_qty)
						: 0
				},
				minSize: 200
			})
		],
		[i18n.language]
	)

	const handleDownloadExcel = async () => {
		toast.loading(t('ns_common:notification.downloading'), { id: DOWNLOAD_INBOUND_REPORT_ID })
		try {
			const blob = await ReportService.downloadInboundReport(currentTenant?.id, searchParams)
			saveAs(blob, `Inbound Report ~ ${searchParams['date.eq']}.xlsx`)
			toast.success(t('ns_common:notification.success'), { id: DOWNLOAD_INBOUND_REPORT_ID })
		} catch {
			toast.error('ns_common:notification.error', { id: DOWNLOAD_INBOUND_REPORT_ID })
		}
	}

	return (
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
				slotLeft: () => isSmallScreen && <DatePickerFilter />,
				slotRight: () => (
					<Fragment>
						<Tooltip message={`${t('ns_common:actions.export')} Excel`} triggerProps={{ asChild: true }}>
							<Button size='icon' variant='outline' onClick={handleDownloadExcel}>
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
	)
}

const InboundReportDetailTable: React.FC<{ data: IInboundReport['size_run'] }> = ({ data }) => {
	const { t } = useTranslation()

	return (
		<Div className='w-1/4 overflow-clip rounded-md border'>
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
								<TableCell align='center' className='w-10' key={item.inbound_qty}>
									{item.inbound_qty}
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

export default ReportDatalist
