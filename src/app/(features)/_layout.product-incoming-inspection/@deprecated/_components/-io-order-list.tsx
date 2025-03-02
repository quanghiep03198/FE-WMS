import { IInOutBoundOrder } from '@/common/types/entities'
import { cn } from '@/common/utils/cn'
import { Button, DataTable, Div, Icon, Tooltip } from '@/components/ui'
import { ROW_EXPANSION_COLUMN_ID } from '@/components/ui/@react-table/constants'
import { DataTableUtility } from '@/components/ui/@react-table/utils/table.util'
import { IOService } from '@/services/inoutbound.service'
import { keepPreviousData, queryOptions, useQuery, useQueryClient } from '@tanstack/react-query'
import { PaginationState, SortingState, createColumnHelper } from '@tanstack/react-table'
import { AxiosRequestConfig } from 'axios'
import { isEmpty, omit } from 'lodash'
import { Fragment, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ProductionApprovalStatus } from '../_constants/production.enum'
import IOSubOrderRow from './-io-order-detail'

const IO_PRODUCTION_PROVIDE_TAG = 'PRODUCTION'

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
	const [sorting, setSorting] = useState<SortingState>([])
	const queryClient = useQueryClient()

	const columns = useMemo(
		() => [
			columnHelper.accessor('id', {
				id: ROW_EXPANSION_COLUMN_ID,
				header: ({ table }) => (
					<Tooltip
						message='Collapse expanded rows'
						triggerProps={{ asChild: true }}
						contentProps={{ side: 'right', sideOffset: 0, alignOffset: 0 }}>
						<button
							className='flex w-full items-center justify-center'
							role='button'
							onClick={() => table.toggleAllRowsExpanded(false)}>
							<Icon name='SquareMinus' size={18} />
						</button>
					</Tooltip>
				),
				meta: { sticky: 'left' },
				size: 64,
				enableSorting: false,
				enableHiding: false,
				enableResizing: false,
				cell: ({ row }) => {
					return row.getCanExpand() ? (
						<button
							className={cn(
								'ease flex w-full items-center justify-center transition-transform duration-150 focus:outline-none',
								row.getIsExpanded() ? 'rotate-90' : 'rotate-0'
							)}
							onClick={row.getToggleExpandedHandler()}>
							<Icon name='ChevronRight' />
						</button>
					) : null
				}
			}),
			columnHelper.accessor('sno_no', {
				header: t('ns_erp:fields.sno_no'),
				enableColumnFilter: true,
				enableSorting: true
			}),
			columnHelper.accessor('status_approve', {
				header: t('ns_erp:fields.status_approve'),
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
				header: t('ns_erp:fields.sno_date'),
				enableSorting: true,
				sortDescFirst: true
			}),
			columnHelper.accessor('ship_order', {
				header: t('ns_erp:fields.ship_order')
			}),
			columnHelper.accessor('dept_name', {
				header: t('ns_erp:fields.dept_name')
			}),
			columnHelper.accessor('employee_name', {
				header: t('ns_erp:fields.employee_name')
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
			search: DataTableUtility.getColumnFiltersObject(columnFilters),
			sort: DataTableUtility.getColumnSortingObject(sorting)
		})
	)

	const prefetch = (params: { page: number; limit: number }) =>
		queryClient.prefetchQuery(
			getProductionQuery({
				...params,
				search: DataTableUtility.getColumnFiltersObject(columnFilters),
				sort: DataTableUtility.getColumnSortingObject(sorting)
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
			renderSubComponent={() => <IOSubOrderRow data={{}} />}
			paginationProps={{ prefetch, ...omit(response, ['data']) }}
			toolbarProps={{
				slotRight: ({ table }) => (
					<Fragment>
						{Object.values(columnFilters).some((value) => !isEmpty(value)) && (
							<Tooltip message={t('ns_common:actions.clear_filter')} triggerProps={{ asChild: true }}>
								<Button
									variant='destructive'
									size='icon'
									onClick={() => {
										table.resetColumnFilters()
									}}>
									<Icon name='X' />
								</Button>
							</Tooltip>
						)}
						<Tooltip message={t('ns_common:actions.reload')} triggerProps={{ asChild: true }}>
							<Button
								variant='outline'
								size='icon'
								onClick={() => {
									table.resetColumnFilters()
									table.resetSorting()
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
