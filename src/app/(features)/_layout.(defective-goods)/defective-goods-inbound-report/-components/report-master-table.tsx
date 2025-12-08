import useMediaQuery from '@/common/hooks/use-media-query'
import useQueryParams from '@/common/hooks/use-query-params'
import formatIntlNumber from '@/common/utils/format-intl-number'
import { Badge, Button, DataTable, Icon, Tooltip, Typography } from '@/components/ui'
import EllipsisList from '@/components/ui/@custom/ellipsis-list'
import { ROW_EXPANSION_COLUMN_ID } from '@/components/ui/@react-table/constants'
import { RenderSubComponent } from '@/components/ui/@react-table/types'
import { IDefectiveGoodsInboundReport } from '@/services/defective-goods.service'
import { createColumnHelper, Table as TTable } from '@tanstack/react-table'
import { format } from 'date-fns'
import { split } from 'lodash-es'
import { Fragment, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { DefectiveCategoryI18n } from '../../-constants'
import { useDefectiveCategoryList } from '../../-hooks/use-defective-category-list'
import { useGetDefectiveGoodInboundReportQuery } from '../../-hooks/use-defective-goods-asm'
import AutoRefreshToggle from '../../../-components/-shared/auto-refresh-toggle'
import SizeTable from '../../../-components/-shared/size-table'
import { useGetTenantByFactory } from '../../../-hooks/use-tenacy-asm'
import DownloadExcelButton from './download-excel-button'
import ReportTableSummary from './report-table-summary'

export type PageQueryParams = {
	'date.eq': string
	'auto-refresh': number | false
}

const InboundReportMasterTable: React.FC = () => {
	const { searchParams } = useQueryParams<PageQueryParams>({
		'date.eq': format(new Date(), 'yyyy-MM-dd'),
		'auto-refresh': false
	})
	const { data: currentTenant } = useGetTenantByFactory()
	const isLargeScreen = useMediaQuery('(min-width: 1024px)')
	const { data, isLoading, refetch } = useGetDefectiveGoodInboundReportQuery(currentTenant?.id, searchParams)
	const { t, i18n } = useTranslation()
	const dataTableRef = useRef<TTable<IDefectiveGoodsInboundReport>>(null)
	const columnHelper = createColumnHelper<IDefectiveGoodsInboundReport>()

	const defectiveCategoryList = useDefectiveCategoryList()

	const factedUniqueStorageLocations = useMemo(() => {
		const locationSet = new Set<string>()
		if (Array.isArray(data)) {
			data.forEach((item: IDefectiveGoodsInboundReport) => {
				const storageLocations = item.storage_location?.split(',')
				if (Array.isArray(storageLocations)) {
					storageLocations.forEach((loc) => locationSet.add(loc))
				}
			})
		}
		return Array.from(locationSet)
			.sort((a, b) => a.localeCompare(b))
			.map((loc) => ({ value: loc, label: loc }))
	}, [data])

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
							className='absolute inset-0 flex h-full w-full items-center justify-center text-muted-foreground transition-colors duration-200 hover:text-foreground'
							onClick={() => table.toggleAllRowsExpanded(false)}>
							<Icon name='ListCollapse' size={18} />
						</button>
					</Tooltip>
				),
				size: 50,
				maxSize: 50,
				enableHiding: false,
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
				enableHiding: false,
				filterFn: 'includesString'
			}),
			columnHelper.accessor('po', {
				header: t('ns_erp:fields.po'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableHiding: false,
				filterFn: 'includesString'
			}),
			columnHelper.accessor('mo_no', {
				header: t('ns_erp:fields.mo_no'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableHiding: false,
				filterFn: 'includesString'
			}),
			columnHelper.accessor('cust_shoes_style', {
				header: t('ns_erp:fields.cust_shoes_style'),
				enableColumnFilter: true,
				enableSorting: true,
				enableHiding: false,
				enablePinning: true,
				filterFn: 'includesString',
				cell: ({ getValue }) => getValue() ?? 'Unknown'
			}),
			columnHelper.accessor('factory_shoes_style', {
				header: t('ns_erp:fields.factory_shoes_style'),
				enableColumnFilter: true,
				enableSorting: true,
				enableHiding: false,
				enablePinning: true,
				filterFn: 'includesString',
				cell: ({ getValue }) => getValue() ?? 'Unknown'
			}),
			columnHelper.accessor('color_sn', {
				header: t('ns_erp:fields.color_sn'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableHiding: false,
				filterFn: 'fuzzy',
				cell: ({ getValue }) => {
					return getValue() ?? 'Unknown'
				}
			}),
			columnHelper.accessor('sewing_line', {
				header: t('ns_erp:fields.sewing_line'),
				enableColumnFilter: true,
				enableSorting: true,
				filterFn: 'includesString',
				cell: ({ getValue }) => {
					const value = getValue()
					if (typeof value !== 'string' || !value.trim())
						return (
							<Typography variant='small' color='muted' className='line-clamp-1'>
								{t('ns_common:titles.unknown')}
							</Typography>
						)
					return (
						<EllipsisList
							threshhold={3}
							data={split(value, ',')
								.filter((item) => !!item)
								.sort((a, b) => a.localeCompare(b))}
							template={({ data }) => (
								<Badge variant='outline' className='max-h-fit whitespace-nowrap font-normal'>
									{data}
								</Badge>
							)}
						/>
					)
				}
			}),
			columnHelper.accessor('assembly_line', {
				header: t('ns_erp:fields.assembly_line'),
				enableColumnFilter: true,
				enableSorting: true,
				filterFn: 'includesString',
				cell: ({ getValue }) => {
					const value = getValue()
					if (typeof value !== 'string' || !value.trim())
						return (
							<Typography variant='small' color='muted' className='line-clamp-1'>
								{t('ns_common:titles.unknown')}
							</Typography>
						)
					return (
						<EllipsisList
							threshhold={3}
							data={split(value, ',')
								.filter((item) => !!item)
								.sort((a, b) => a.localeCompare(b))}
							template={({ data }) => (
								<Badge variant='outline' className='max-h-fit whitespace-nowrap font-normal'>
									{data}
								</Badge>
							)}
						/>
					)
				}
			}),
			columnHelper.accessor('defective_category', {
				header: t('ns_erp:fields.category'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableHiding: false,
				filterFn: 'equalsString',
				meta: {
					filterVariant: 'select',
					facetedUniqueValues: defectiveCategoryList
				},
				cell: ({ getValue }) => {
					const value = getValue()
					return t(DefectiveCategoryI18n[value], {
						ns: 'ns_inoutbound',
						defaultValue: 'Unknown'
					})
				}
			}),
			columnHelper.accessor('storage_location', {
				header: t('ns_warehouse:fields.storage_name'),
				enableColumnFilter: true,
				enableSorting: true,
				filterFn: 'arrIncludesSome',
				meta: { filterVariant: 'multi-select', facetedUniqueValues: factedUniqueStorageLocations },
				cell: ({ getValue }) => {
					const value = getValue()
					return (
						<EllipsisList
							threshhold={3}
							data={split(value, ',').sort((a, b) => a.localeCompare(b))}
							template={({ data }) => (
								<Badge variant='secondary' className='whitespace-nowrap'>
									{data.trim()}
								</Badge>
							)}
						/>
					)
				}
			}),

			columnHelper.accessor('daily_inbound_qty', {
				header: t('ns_erp:fields.daily_inbound_qty'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableHiding: false,
				meta: { filterVariant: 'range', align: 'right' },
				filterFn: 'inNumberRange',
				cell: ({ getValue }) => formatIntlNumber(getValue())
			})
		],
		[i18n.language]
	)

	return (
		<DataTable
			columns={columns}
			data={data}
			loading={isLoading}
			enableExpanding={true}
			enableColumnResizing={true}
			ref={dataTableRef}
			containerProps={{ className: 'xxl:h-[60vh] h-[50vh]' }}
			renderSubComponent={
				(({ row }) => {
					return <SizeTable data={row.original?.size_data} />
				}) satisfies RenderSubComponent<IDefectiveGoodsInboundReport>
			}
			toolbarProps={{
				slotLeft: () => <AutoRefreshToggle />,
				slotRight: () => (
					<Fragment>
						{!isLargeScreen && <DownloadExcelButton />}
						<Tooltip message={t('ns_common:actions.reload')} triggerProps={{ asChild: true }}>
							<Button size='icon' variant='outline' onClick={() => refetch()}>
								<Icon name='RotateCw' />
							</Button>
						</Tooltip>
					</Fragment>
				)
			}}
			footerProps={{
				slot: () => <ReportTableSummary data={data} />
			}}
		/>
	)
}

export default InboundReportMasterTable
