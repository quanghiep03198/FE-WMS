import SizeTable from '@/app/(features)/_layout.production-inventory/-components/partials/size-table'
import { IDefectiveGoodsInventory } from '@/common/types/entities'
import { Badge, Button, DataTable, Icon, Tooltip } from '@/components/ui'
import EllipsisList from '@/components/ui/@custom/ellipsis-list'
import { ROW_EXPANSION_COLUMN_ID } from '@/components/ui/@react-table/constants'
import { RenderSubComponent } from '@/components/ui/@react-table/types'
import { createColumnHelper } from '@tanstack/react-table'
import { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetDefectiveGoodsInventoryQuery } from '../../-hooks/use-defective-goods-asm'

export type UrlQueryParams = {
	'date.eq': string
	'auto-refresh': number | false
}

const DefectiveGoodsInventoryMasterTable: React.FC = () => {
	const { data, isLoading, refetch } = useGetDefectiveGoodsInventoryQuery()
	const { t, i18n } = useTranslation()
	const columnHelper = createColumnHelper<IDefectiveGoodsInventory>()

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
			columnHelper.accessor('po', {
				header: t('ns_erp:fields.po'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableHiding: false,
				filterFn: 'includesString',
				cell: ({ getValue }) => getValue() ?? 'Unknown'
			}),
			columnHelper.accessor('mo_no', {
				header: t('ns_erp:fields.mo_no'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableHiding: false,
				filterFn: 'includesString',
				cell: ({ getValue }) => getValue() ?? 'Unknown'
			}),
			columnHelper.accessor('cust_shoes_style', {
				header: t('ns_erp:fields.cust_shoes_style'),
				enableColumnFilter: true,
				enableSorting: true,
				enableHiding: false,
				enablePinning: true,
				filterFn: 'fuzzy',
				cell: ({ getValue }) => getValue() ?? 'Unknown'
			}),
			columnHelper.accessor('factory_shoes_style', {
				header: t('ns_erp:fields.shoestyle_codefactory'),
				enableColumnFilter: true,
				enableSorting: true,
				enableHiding: false,
				enablePinning: true,
				filterFn: 'fuzzy',
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
			columnHelper.accessor('storage_location', {
				header: t('ns_warehouse:fields.storage_name'),
				enableColumnFilter: true,
				enableSorting: true,
				filterFn: 'fuzzy',
				cell: ({ getValue }) => {
					const value = getValue()
					return (
						<EllipsisList
							threshhold={3}
							data={value.sort((a, b) => a.localeCompare(b))}
							template={({ data }) => (
								<Badge variant='secondary' className='whitespace-nowrap'>
									{data.trim()}
								</Badge>
							)}
						/>
					)
				}
			}),
			columnHelper.display({
				id: 'total_qty',
				header: t('ns_common:common_fields.total'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				meta: { filterVariant: 'range', align: 'right' },
				filterFn: 'inNumberRange',
				cell: ({ row }) => {
					if (!Array.isArray(row.original.size_data)) return 0
					return row.original.size_data.reduce((acc, curr) => acc + curr.qty, 0)
				}
			})
		],
		[i18n.language]
	)

	// const handleDownloadExcel = useDownloadReport()

	return (
		<DataTable
			columns={columns}
			data={data}
			loading={isLoading}
			enableExpanding={true}
			enableColumnResizing={true}
			containerProps={{ className: 'h-[60vh]' }}
			renderSubComponent={
				(({ row }) => {
					return <SizeTable data={row.original?.size_data} />
				}) satisfies RenderSubComponent<IDefectiveGoodsInventory>
			}
			toolbarProps={{
				slotRight: () => (
					<Fragment>
						<Tooltip message={`${t('ns_common:actions.export')} Excel`} triggerProps={{ asChild: true }}>
							<Button
								size='icon'
								variant='outline'
								// onClick={handleDownloadExcel}
								disabled={!data || data.length === 0}>
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
			// footerProps={{
			// 	slot: () => <ReportTableSummary data={data} />
			// }}
		/>
	)
}

export default DefectiveGoodsInventoryMasterTable
