import useMediaQuery from '@/common/hooks/use-media-query'
import formatIntlNumber from '@/common/utils/format-intl-number'
import { DataTable, Icon, Tooltip } from '@/components/ui'
import TableCellText from '@/components/ui/@react-table/components/table-cell-text'
import { ROW_ACTIONS_COLUMN_ID, ROW_EXPANSION_COLUMN_ID } from '@/components/ui/@react-table/constants'
import type { DataTableProps, RenderSubComponentProps } from '@/components/ui/@react-table/types'
import type { ITruckloadDelivery } from '@/services/truckload-delivery.service'
import { useQueryClient } from '@tanstack/react-query'
import type { PaginationState, SortingState } from '@tanstack/react-table'
import { createColumnHelper } from '@tanstack/react-table'
import { useDeepCompareEffect, useResetState } from 'ahooks'
import { unflatten } from 'flat'
import { isNil, omit, omitBy } from 'lodash-es'
import { useCallback, useEffect, useEffectEvent, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { FlattenedPageQueryParams, PageQueryParams } from '../-hooks/use-page-query-params'
import { usePageQueryParams } from '../-hooks/use-page-query-params'
import {
	getTruckloadDeliveryDetailQueryOptions,
	getTruckloadDeliveryQueryOptions,
	useGetTruckloadDeliveryQuery
} from '../-hooks/use-truckload-delivery-asm'
import { GhostButton } from '../../-components/shared/ghost-button'
import RowActions from './row-actions'
import {
	ContainerStatusCheckbox,
	DateTimeCell,
	DepartureTimeCell,
	DispatchOrderStatusBadge,
	LicensePlateColumnCell
} from './truck-load-delivery-table-cells'
import TruckloadDeliveryDetailTable from './truckload-delivery-detail-table'
import TruckloadDeliveryTableToolbar from './truckload-delivery-table-toolbar'

const FALLBACK_TABLE_DATA = []

const TruckloadDeliveryMasterTable: React.FC = () => {
	const { t, i18n } = useTranslation()
	const isMobile = useMediaQuery('(max-width: 1023px)')
	const { data, isFetching } = useGetTruckloadDeliveryQuery()
	const [tableData, setTableData, resetTableData] = useResetState<ITruckloadDelivery[]>(
		Array.isArray(data?.data) ? data?.data : FALLBACK_TABLE_DATA
	)
	const columnHelper = createColumnHelper<ITruckloadDelivery>()
	const [expanded, setExpanded, resetExpanded] = useResetState<{ [key: string]: boolean }>({})
	const queryClient = useQueryClient()
	const { searchParams, setParams } = usePageQueryParams()
	const defaultSortingState = useMemo(() => {
		const flattenedSearchParams = unflatten<PageQueryParams, FlattenedPageQueryParams>(searchParams)
		return flattenedSearchParams?.sort
			? Object.entries(flattenedSearchParams.sort).map(([key, value]) => ({ id: key, desc: value === 'desc' }))
			: []
	}, [searchParams])
	const [sorting, setSorting] = useState<SortingState>(defaultSortingState)

	const licensePlateColumnHeader = !isMobile
		? t('ns_erp:fields.license_plate')
		: t('ns_erp:fields.license_plate') + ' / ' + t('ns_erp:fields.container_number')

	const columns = useMemo(
		() => [
			columnHelper.display({
				id: ROW_EXPANSION_COLUMN_ID,
				header: () => (
					<Tooltip message={t('ns_common:actions.fold')} triggerProps={{ asChild: true }}>
						<GhostButton className='absolute inset-0' onClick={() => resetExpanded()}>
							<Icon name='ListCollapse' size={18} />
						</GhostButton>
					</Tooltip>
				),
				size: 50,
				maxSize: 50,
				enableHiding: false,
				enableResizing: false,
				enableSorting: false,
				enableGlobalFilter: false,
				enableColumnFilter: false,
				meta: { align: 'center' },
				cell: ({ row }) => (
					<GhostButton
						className='absolute inset-0'
						disabled={false}
						onPointerEnter={() =>
							queryClient.prefetchQuery(getTruckloadDeliveryDetailQueryOptions(row.original.dispatch_order))
						}
						onClick={() => {
							setExpanded({ [row.original.dispatch_order]: !row.getIsExpanded() })
							if (row.getIsExpanded()) resetTableData()
							else
								setTableData((prev) =>
									prev.filter((item) => item.dispatch_order === row.original.dispatch_order)
								)
						}}>
						<Icon name={row.getIsExpanded() ? 'ChevronDown' : 'ChevronRight'} />
					</GhostButton>
				)
			}),
			columnHelper.accessor('license_plate', {
				id: 'license_plate',
				header: licensePlateColumnHeader,
				enableResizing: true,
				enableSorting: true,
				enableMultiSort: false,
				filterFn: 'fuzzy',
				enableGlobalFilter: true,
				cell: LicensePlateColumnCell
			}),
			columnHelper.accessor('container_number', {
				id: 'container_number',
				header: t('ns_erp:fields.container_number'),
				meta: { hidden: isMobile },
				enableResizing: true,
				enableSorting: true,
				enableMultiSort: false,
				enableGlobalFilter: true,
				sortDescFirst: true,
				filterFn: 'fuzzy',
				minSize: 150,
				size: 150,
				maxSize: 250,
				cell: TableCellText
			}),
			columnHelper.accessor('total_outbound_qty', {
				header: t('ns_erp:fields.outbound_qty'),
				enableSorting: true,
				enableMultiSort: false,
				meta: { align: 'right', hidden: isMobile },
				cell: ({ getValue }) => formatIntlNumber(getValue() as number)
			}),
			columnHelper.accessor('punctured_container', {
				header: t('ns_erp:fields.punctured_container'),
				enableSorting: false,
				meta: { align: 'center', hidden: isMobile },
				cell: ContainerStatusCheckbox
			}),
			columnHelper.accessor('smelling_container', {
				header: t('ns_erp:fields.smelling_container'),
				enableSorting: false,
				meta: { align: 'center', hidden: isMobile },
				cell: ContainerStatusCheckbox
			}),
			columnHelper.accessor('moist_container', {
				header: t('ns_erp:fields.moist_container'),
				enableSorting: false,
				meta: { align: 'center', hidden: isMobile },
				cell: ContainerStatusCheckbox
			}),
			columnHelper.accessor('approval_status', {
				header: t('ns_erp:fields.status_approve'),
				enableResizing: true,
				enableSorting: true,
				enableMultiSort: false,
				enablePinning: true,
				enableColumnFilter: true,
				enableGlobalFilter: false,
				filterFn: 'equals',
				minSize: 150,
				size: 180,
				maxSize: 200,
				cell: DispatchOrderStatusBadge
			}),
			columnHelper.accessor('created_at', {
				header: t('ns_common:common_fields.created_at'),
				meta: { hidden: isMobile },
				enableResizing: true,
				enableSorting: true,
				enableMultiSort: false,
				enableColumnFilter: false,
				enableGlobalFilter: false,
				minSize: 150,
				size: 200,
				maxSize: 250,
				cell: DateTimeCell
			}),
			columnHelper.accessor('container_sealing_time', {
				header: t('ns_erp:fields.container_sealing_time'),
				enableResizing: true,
				enableSorting: true,
				enableMultiSort: false,
				enableColumnFilter: false,
				enableGlobalFilter: false,
				minSize: 150,
				size: 200,
				maxSize: 250,
				cell: DateTimeCell
			}),
			columnHelper.accessor('factory_departure_time', {
				header: t('ns_erp:fields.factory_departure_time'),
				enableResizing: true,
				enableSorting: true,
				enableMultiSort: false,
				enableColumnFilter: false,
				enableGlobalFilter: false,
				minSize: 150,
				size: 200,
				maxSize: 250,
				cell: DepartureTimeCell
			}),
			columnHelper.accessor('actual_departure_time', {
				header: t('ns_erp:fields.actual_departure_time'),
				meta: { hidden: isMobile },
				enableResizing: true,
				enableSorting: true,
				enableColumnFilter: false,
				enableGlobalFilter: false,
				minSize: 150,
				size: 200,
				maxSize: 250,
				cell: DateTimeCell
			}),
			columnHelper.display({
				id: ROW_ACTIONS_COLUMN_ID,
				enableResizing: false,
				enableSorting: false,
				enableGlobalFilter: false,
				enableColumnFilter: false,
				size: 60,
				maxSize: 60,
				meta: { align: 'center' },
				cell: RowActions
			})
		],
		[i18n.language, isMobile]
	)

	const renderSubTable = useCallback(({ row }: RenderSubComponentProps<ITruckloadDelivery>) => {
		const data = row.original
		return <TruckloadDeliveryDetailTable data={data} onCollapse={resetExpanded} />
	}, [])

	const toolbarProps: DataTableProps['toolbarProps'] = useMemo(
		() => ({
			override: true,
			render: TruckloadDeliveryTableToolbar
		}),
		[]
	)

	const virtualizerOptions = useMemo(() => ({ estimateSize: isMobile ? 60 : 40 }), [isMobile])

	const changePagination = useCallback(
		({ pageIndex, pageSize }: PaginationState) => {
			if (typeof pageIndex === 'number' && typeof pageSize === 'number')
				setParams({ ...searchParams, page: pageIndex, limit: pageSize })
		},
		[searchParams]
	)

	const onExpandedChange = useEffectEvent(() => {
		console.log('data?.data', data?.data)
		const currentData = Array.isArray(data?.data) ? data.data : []
		console.log('expanded', expanded)

		let isSomeRowExpanded = false
		for (const rowId in expanded) {
			if (expanded[rowId]) {
				isSomeRowExpanded = true
				break
			}
		}
		const expandedRowData = !isSomeRowExpanded
			? currentData
			: [
					currentData.find((item) =>
						Object.entries(expanded).some(([rowId, isExpanded]) =>
							isExpanded ? item.dispatch_order === rowId : true
						)
					)
				].filter((item) => !isNil(item))
		if (!expandedRowData.length) {
			setTableData(currentData)
			resetExpanded()
		} else setTableData(expandedRowData)
	})

	// Sync tableData with data and expanded state in a single effect
	useEffect(onExpandedChange, [data?.data, expanded])

	useDeepCompareEffect(() => {
		if (!('page' in searchParams) || !('limit' in searchParams)) return
		// * Clone search params
		const noneSortingParams = omitBy(searchParams, (_value, key) => key.startsWith('sort'))

		// * Rebuild sorting params
		const sortingParams = sorting.reduce(
			(acc, curr) => ({ ...acc, [`sort.${curr.id}`]: curr.desc ? 'desc' : 'asc' }),
			{}
		)

		// * Set search params with new sorting params
		setParams({ ...noneSortingParams, ...sortingParams } as PageQueryParams)
	}, [sorting])

	const handlePrefetch = useCallback(
		async (params: Pick<Pagination<ITruckloadDelivery>, 'page' | 'limit'>) => {
			return await queryClient.prefetchQuery(getTruckloadDeliveryQueryOptions({ ...searchParams, ...params }))
		},
		[searchParams]
	)

	return (
		/* eslint-disable */
		// @ts-ignore
		<DataTable
			columns={columns}
			data={tableData}
			border='bottom-only'
			loading={isFetching}
			expanded={expanded}
			enableGlobalFilter={true}
			enableExpanding={true}
			getRowCanExpand={() => true}
			getColumnCanGlobalFilter={() => true}
			getRowId={(originalRow: ITruckloadDelivery) => originalRow.dispatch_order}
			sorting={sorting}
			enableMultiSort={false}
			manualExpanding={true}
			manualFiltering={true}
			manualPagination={true}
			manualSorting={true}
			isMultiSortEvent={() => false}
			sortDescFirst={true}
			paginationProps={{
				...omit(data, 'data'),
				enableInputPageSize: false,
				prefetch: handlePrefetch
			}}
			onPaginationChange={changePagination}
			onSortingChange={setSorting}
			globalFilterFn='includesString'
			initialState={{ sorting: [{ id: 'dispatch_order', desc: true }] }}
			virtualizerOptions={virtualizerOptions}
			toolbarProps={toolbarProps}
			containerProps={{
				style: { height: 'calc(var(--outlet-wrapper-height) - 10.5rem)' },
				className:
					'[&_tr[data-role=expandable-row]_*]:animate-none [&_tr[data-role=expandable-row]_*]:transition-none [&_tr[data-role=data-grid-row][aria-expanded=true]>td[data-role=data-grid-cell]]:!z-10 [&_tr[data-role=data-grid-row][aria-expanded=true]>td[data-role=data-grid-cell]]:!sticky [&_tr[data-role=data-grid-row][aria-expanded=true]>td[data-role=data-grid-cell]]:!top-[--header-row-height]'
			}}
			renderSubComponent={renderSubTable}
		/>
	)
}

export default TruckloadDeliveryMasterTable
