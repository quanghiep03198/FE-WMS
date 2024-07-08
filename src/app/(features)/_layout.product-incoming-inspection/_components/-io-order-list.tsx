import { Fragment, useMemo, useState } from 'react'
import { AxiosRequestConfig } from 'axios'
import { isEmpty, omit } from 'lodash'
import { useTranslation } from 'react-i18next'
import { keepPreviousData, queryOptions, useQuery, useQueryClient } from '@tanstack/react-query'
import { PaginationState, SortingState, Table, createColumnHelper } from '@tanstack/react-table'
import { IOSubOrderRow } from './-io-order-detail'
import { IInOutBoundOrder } from '@/common/types/entities'
import { Button, DataTable, Div, Icon, Tooltip } from '@/components/ui'
import { TableUtilities } from '@/components/ui/@react-table/utils/table.util'
import { IOService } from '@/services/inoutbound.service'
import { ProductionApprovalStatus } from '../_constants/-production.enum'

const IO_PRODUCTION_PROVIDE_TAG = 'PRODUCTION' as const

const getProductionQuery = (searchParams: Record<string, any>) =>
	queryOptions({
		queryKey: [IO_PRODUCTION_PROVIDE_TAG, searchParams],
		queryFn: () => IOService.getProduction(searchParams),
		placeholderData: keepPreviousData,
		select: (response) => response.metadata
	})

const InOutBoundOrderList: React.FC = () => {
	const { t, i18n } = useTranslation()
	const columnHelper = createColumnHelper<IInOutBoundOrder>()
	const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
	const [columnFilters, setColumnFilters] = useState<AxiosRequestConfig['params']>([])
	const [tableInstance, setTableInstance] = useState<Table<any>>()
	const [sorting, setSorting] = useState<SortingState>([])
	const queryClient = useQueryClient()

	const columns = useMemo(
		() => [
			columnHelper.accessor('id', {
				id: 'row-expander',
				header: ({ table }) => (
					<Tooltip
						message={table.getIsAllRowsExpanded() ? t('ns_common:actions.close') : t('ns_common:actions.open')}
						triggerProps={{ asChild: true }}
						contentProps={{ side: 'right', sideOffset: 0, alignOffset: 0 }}>
						<button
							className='flex w-full items-center justify-center'
							role='button'
							onClick={() => table.toggleAllRowsExpanded()}>
							<Icon name={table.getIsAllRowsExpanded() ? 'FoldVertical' : 'UnfoldVertical'} />
						</button>
					</Tooltip>
				),
				meta: {
					sticky: 'left'
				},
				size: 64,
				enableSorting: false,
				enableHiding: false,
				enableResizing: false,
				cell: ({ row }) => {
					return row.getCanExpand() ? (
						<button className='flex w-full items-center justify-center' onClick={row.getToggleExpandedHandler()}>
							{row.getIsExpanded() ? <Icon name='ChevronDown' /> : <Icon name='ChevronRight' />}
						</button>
					) : null
				}
			}),
			columnHelper.accessor('sno_no', {
				header: t('ns_inoutbound:fields.sno_no'),
				enableColumnFilter: true,
				enableSorting: true
			}),
			columnHelper.accessor('status_approve', {
				header: t('ns_inoutbound:fields.status_approve'),
				size: 160,
				cell: ({ getValue }) => {
					const value = getValue()
					return value === ProductionApprovalStatus.REVIEWED ? (
						<Div className='flex items-center justify-center'>
							<Icon name='Check' stroke='hsl(var(--primary))' size={20} />
						</Div>
					) : null
				}
			}),
			columnHelper.accessor('sno_date', {
				header: t('ns_inoutbound:fields.sno_date'),
				enableSorting: true,
				sortDescFirst: true
			}),
			columnHelper.accessor('ship_order', {
				header: t('ns_inoutbound:fields.ship_order')
			}),
			columnHelper.accessor('dept_name', {
				header: t('ns_inoutbound:fields.dept_name')
			}),
			columnHelper.accessor('employee_name', {
				header: t('ns_inoutbound:fields.employee_name')
			}),
			columnHelper.accessor('updated', {
				header: t('ns_common:common_fields.updated_at')
			}),
			columnHelper.accessor('remark', {
				header: t('ns_common:common_fields.remark')
			})
		],
		[i18n.language]
	)

	const {
		data: response,
		isLoading,
		refetch
	} = useQuery(
		getProductionQuery({
			page: pagination.pageIndex + 1,
			limit: pagination.pageSize,
			search: TableUtilities.getColumnFiltersObject(columnFilters),
			sort: TableUtilities.getColumnSortingObject(sorting)
		})
	)

	const prefetch = (params: { page: number; limit: number }) =>
		queryClient.prefetchQuery(
			getProductionQuery({
				...params,
				search: TableUtilities.getColumnFiltersObject(columnFilters),
				sort: TableUtilities.getColumnSortingObject(sorting)
			})
		)

	return (
		<DataTable
			caption='The list of production order'
			data={response?.data}
			loading={isLoading}
			columns={columns}
			containerProps={{ style: { height: screen.height / 2 } }}
			manualPagination={true}
			manualSorting={true}
			manualFiltering={true}
			enableExpanding={true}
			enableColumnFilters={true}
			enableGlobalFilter={false}
			getRowCanExpand={() => true}
			sorting={sorting}
			columnFilters={columnFilters}
			onColumnFiltersChange={setColumnFilters}
			onSortingChange={setSorting}
			onPaginationChange={setPagination}
			onGetInstance={setTableInstance}
			renderSubComponent={() => <IOSubOrderRow data={{}} />}
			paginationProps={{ prefetch, ...omit(response, ['data']) }}
			toolbarProps={{
				slot: () => (
					<Fragment>
						{Object.values(columnFilters).some((value) => !isEmpty(value)) && (
							<Tooltip message={t('ns_common:actions.clear_filter')}>
								<Button
									variant='destructive'
									size='icon'
									onClick={() => {
										tableInstance.resetColumnFilters()
									}}>
									<Icon name='X' />
								</Button>
							</Tooltip>
						)}
						<Tooltip message={t('ns_common:actions.reload')}>
							<Button
								variant='outline'
								size='icon'
								onClick={() => {
									tableInstance.resetColumnFilters()
									tableInstance.resetSorting()
									refetch()
								}}>
								<Icon name='RotateCw' />
							</Button>
						</Tooltip>
					</Fragment>
				)
			}}
		/>
	)
}

export default InOutBoundOrderList
