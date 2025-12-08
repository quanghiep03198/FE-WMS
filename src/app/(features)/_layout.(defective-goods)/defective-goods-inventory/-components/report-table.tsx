import SizeTable from '@/app/(features)/-components/-shared/size-table'
import { Badge, Button, DataTable, Icon, Tooltip, Typography } from '@/components/ui'
import EllipsisList from '@/components/ui/@custom/ellipsis-list'
import { ROW_EXPANSION_COLUMN_ID } from '@/components/ui/@react-table/constants'
import { IDefectiveGoodsInventory } from '@/services/defective-goods.service'
import { createColumnHelper } from '@tanstack/react-table'
import { split } from 'lodash-es'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import ReportTableSummary from '../../-components/report-table-footer'
import { DefectiveCategoryI18n } from '../../-constants'
import { useDefectiveCategoryList } from '../../-hooks/use-defective-category-list'
import { useGetDefectiveGoodsInventoryQuery } from '../../-hooks/use-defective-goods-asm'
import { useGetCategoriesQty } from '../../-hooks/use-get-category-qty'
import { useGetUniqStorageLocation } from '../../-hooks/use-get-uniq-storage-location'

const DefectiveGoodsInventoryTable: React.FC = () => {
	const { data, isLoading, refetch } = useGetDefectiveGoodsInventoryQuery()
	const summaryData = useGetCategoriesQty(data)
	const { t, i18n } = useTranslation()
	const columnHelper = createColumnHelper<IDefectiveGoodsInventory>()
	const defectiveCategoryList = useDefectiveCategoryList()
	const factedUniqueStorageLocations = useGetUniqStorageLocation(data)

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
				filterFn: 'includesString',
				cell: ({ getValue }) =>
					getValue() ?? (
						<Typography variant='small' color='muted' className='line-clamp-1'>
							{t('ns_common:titles.unknown')}
						</Typography>
					)
			}),
			columnHelper.accessor('po', {
				header: t('ns_erp:fields.po'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableHiding: false,
				filterFn: 'includesString',
				cell: ({ getValue }) =>
					getValue() ?? (
						<Typography variant='small' color='muted' className='line-clamp-1'>
							{t('ns_common:titles.unknown')}
						</Typography>
					)
			}),
			columnHelper.accessor('mo_no', {
				header: t('ns_erp:fields.mo_no'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableHiding: false,
				filterFn: 'includesString',
				cell: ({ getValue }) =>
					getValue() ?? (
						<Typography variant='small' color='muted' className='line-clamp-1'>
							{t('ns_common:titles.unknown')}
						</Typography>
					)
			}),
			columnHelper.accessor('cust_shoes_style', {
				header: t('ns_erp:fields.cust_shoes_style'),
				enableColumnFilter: true,
				enableSorting: true,
				enableHiding: false,
				enablePinning: true,
				filterFn: 'fuzzy',
				cell: ({ getValue }) =>
					getValue() ?? (
						<Typography variant='small' color='muted' className='line-clamp-1'>
							{t('ns_common:titles.unknown')}
						</Typography>
					)
			}),
			columnHelper.accessor('factory_shoes_style', {
				header: t('ns_erp:fields.factory_shoes_style'),
				enableColumnFilter: true,
				enableSorting: true,
				enableHiding: false,
				enablePinning: true,
				filterFn: 'fuzzy',
				cell: ({ getValue }) =>
					getValue() ?? (
						<Typography variant='small' color='muted' className='line-clamp-1'>
							{t('ns_common:titles.unknown')}
						</Typography>
					)
			}),
			columnHelper.accessor('color_sn', {
				header: t('ns_erp:fields.color_sn'),
				enableColumnFilter: true,
				enableSorting: true,
				enablePinning: true,
				enableHiding: false,
				filterFn: 'fuzzy',
				cell: ({ getValue }) =>
					getValue() ?? (
						<Typography variant='small' color='muted' className='line-clamp-1'>
							{t('ns_common:titles.unknown')}
						</Typography>
					)
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
					const value = getValue<string | null>()
					if (typeof value !== 'string' || !value) return t('ns_common:titles.unknown')
					return (
						<EllipsisList
							threshhold={3}
							data={split(value, ',').sort((a: string, b: string) => a.localeCompare(b)) as string[]}
							template={({ data }) => (
								<Badge variant='secondary' className='whitespace-nowrap'>
									{data.trim()}
								</Badge>
							)}
						/>
					)
				}
			}),
			columnHelper.accessor('total_qty', {
				header: t('ns_erp:fields.actual_inventory_qty'),
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

	const renderSubComponent = useCallback(
		({ row }) => {
			return (
				<SizeTable
					data={row.original.size_data}
					total={
						Array.isArray(row.original.size_data)
							? row.original.size_data.reduce((acc, curr) => acc + curr.qty, 0)
							: 0
					}
				/>
			)
		},
		[data]
	)

	return (
		<DataTable
			columns={columns}
			data={data}
			loading={isLoading}
			enableExpanding={true}
			enableColumnResizing={true}
			containerProps={{ className: 'h-[60vh]' }}
			renderSubComponent={renderSubComponent}
			toolbarProps={{
				slotRight: () => (
					<Tooltip message={t('ns_common:actions.reload')} triggerProps={{ asChild: true }}>
						<Button size='icon' variant='outline' onClick={() => refetch()}>
							<Icon name='RotateCw' />
						</Button>
					</Tooltip>
				)
			}}
			footerProps={{
				slot: () => <ReportTableSummary summaryData={summaryData} />
			}}
		/>
	)
}

export default DefectiveGoodsInventoryTable
