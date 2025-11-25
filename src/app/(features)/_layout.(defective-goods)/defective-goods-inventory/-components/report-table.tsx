import SizeTable from '@/app/(features)/-components/-shared/size-table'
import { IDefectiveGoodsInventory } from '@/common/types/entities'
import { Badge, Button, DataTable, Icon, Tooltip } from '@/components/ui'
import EllipsisList from '@/components/ui/@custom/ellipsis-list'
import { ROW_EXPANSION_COLUMN_ID } from '@/components/ui/@react-table/constants'
import { createColumnHelper } from '@tanstack/react-table'
import { split } from 'lodash'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { DefectiveCategory, DefectiveCategoryI18n } from '../../-constants'
import { useDefectiveCategoryList } from '../../-hooks/use-defective-category-list'
import { useGetDefectiveGoodsInventoryQuery } from '../../-hooks/use-defective-goods-asm'
import ReportTableSummary from './report-table-footer'

const DefectiveGoodsInventoryTable: React.FC = () => {
	const { data, isLoading, refetch } = useGetDefectiveGoodsInventoryQuery()
	const { t, i18n } = useTranslation()
	const columnHelper = createColumnHelper<IDefectiveGoodsInventory>()
	const defectiveCategoryList = useDefectiveCategoryList()

	const factedUniqueStorageLocations = useMemo(() => {
		const locationSet = new Set<string>()
		if (Array.isArray(data)) {
			data.forEach((item: IDefectiveGoodsInventory) => {
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
				cell: ({ getValue }) => getValue() ?? 'Unknown'
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
				header: t('ns_erp:fields.factory_shoes_style'),
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

				cell: ({ getValue }) => getValue() ?? 'Unknown'
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

	const summaryData = useMemo(() => {
		const result: Record<DefectiveCategory, number> = {
			[DefectiveCategory.B_GRADE]: 0,
			[DefectiveCategory.C_GRADE]: 0,
			[DefectiveCategory.RESEARCH_DEVELOPMENT]: 0
		}
		if (!Array.isArray(data)) return result
		const groupData = Object.groupBy(data, (item: IDefectiveGoodsInventory) => item.defective_category)
		for (const category in groupData) {
			result[category] = groupData[category].reduce((sum, curr) => {
				if (!Array.isArray(curr.size_data)) return sum
				return sum + curr.size_data.reduce((acc, size) => acc + size.qty, 0)
			}, 0)
		}
		return result
	}, [data])

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
