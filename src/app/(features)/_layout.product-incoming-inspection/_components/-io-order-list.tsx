import useQueryParams from '@/common/hooks/use-query-params'
import { IInOutBoundOrder } from '@/common/types/entities'
import { Button, DataTable, Div, Icon, DivProps, Typography, TypographyProps, Badge } from '@/components/ui'
import { IOService } from '@/services/inoutbound.service'
import { keepPreviousData, queryOptions, usePrefetchQuery, useQuery, useQueryClient } from '@tanstack/react-query'
import { PaginationState, createColumnHelper } from '@tanstack/react-table'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import _ from 'lodash'
import tw from 'tailwind-styled-components'
import { ProductionApproveStatus } from '@/common/constants/enums'

const IO_PRODUCTION_PROVIDE_TAG = 'production' as const

const getIOProductionQuery = (searchParams: Record<string, any>) =>
	queryOptions({
		queryKey: [IO_PRODUCTION_PROVIDE_TAG, searchParams],
		queryFn: () => IOService.getProduction(searchParams),
		placeholderData: keepPreviousData,
		select: (response) => response.metadata
	})

const IOOrderList: React.FC = () => {
	const { t, i18n } = useTranslation()
	const columnHelper = createColumnHelper<IInOutBoundOrder>()
	const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
	const queryClient = useQueryClient()

	const columns = useMemo(
		() => [
			columnHelper.accessor('id', {
				id: 'row-expander',
				header: null,
				size: 56,
				enableResizing: false,
				cell: ({ row }) => {
					return row.getCanExpand() ? (
						<button onClick={row.getToggleExpandedHandler()}>
							{row.getIsExpanded() ? <Icon name='ChevronDown' /> : <Icon name='ChevronRight' />}
						</button>
					) : null
				}
			}),
			columnHelper.accessor('sno_no', {
				header: t('ns_inoutbound:fields.sno_no')
			}),
			columnHelper.accessor('status_approve', {
				header: t('ns_inoutbound:fields.status_approve'),
				size: 64,
				cell: ({ getValue }) => {
					const value = getValue()
					return value === ProductionApproveStatus.REVIEWED ? (
						<Icon
							name='BadgeCheck'
							fill='hsl(var(--primary))'
							stroke='hsl(var(--primary-foreground))'
							size={20}
						/>
					) : (
						value
					)
				}
			}),
			columnHelper.accessor('sno_date', {
				header: t('ns_inoutbound:fields.sno_date')
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
			columnHelper.accessor('remark', {
				header: t('ns_common:common_fields.remark')
			})
		],
		[i18n.language]
	)

	const { data, isLoading } = useQuery(
		getIOProductionQuery({ page: pagination.pageIndex + 1, limit: pagination.pageSize })
	)

	const prefetch = (params: { page: number; limit: number }) => queryClient.prefetchQuery(getIOProductionQuery(params))

	return (
		<DataTable
			data={data?.data}
			loading={isLoading}
			columns={columns}
			manualPagination={true}
			onPaginationChange={setPagination}
			getRowCanExpand={() => true}
			renderSubComponent={() => <IOSubOrderRow data={{}} />}
			paginationProps={{ ..._.omit(data, ['data']), prefetch }}
		/>
	)
}

const IOSubOrderRow: React.FC<{ data: any }> = ({ data }) => {
	const { t } = useTranslation()

	return (
		<List role='table'>
			<ListItem role='row'>
				<Typography role='cell'>{t('ns_inoutbound:fields.sno_no')}</Typography>
				<Badge variant='secondary'>-</Badge>
			</ListItem>
			<ListItem role='row'>
				<Typography>{t('ns_inoutbound:fields.container_order_code')}</Typography>
				<Badge variant='secondary'>-</Badge>
			</ListItem>
			<ListItem role='row'>
				<Typography>{t('ns_inoutbound:fields.order_qty')}</Typography>
				<Badge variant='secondary'>-</Badge>
			</ListItem>
			<ListItem role='row'>
				<Typography>{t('ns_inoutbound:fields.order_qty')}</Typography>
				<Badge variant='secondary'>-</Badge>
			</ListItem>
			<ListItem role='row'>
				<Typography>{t('ns_inoutbound:fields.conversion_rate')}</Typography>
				<Badge variant='secondary'>-</Badge>
			</ListItem>
			<ListItem role='row'>
				<Typography>{t('ns_inoutbound:fields.required_date')}</Typography>
				<Badge variant='secondary'>-</Badge>
			</ListItem>
			<ListItem role='row'>
				<Typography>{t('ns_inoutbound:fields.uninspected_qty')}</Typography>
				<Badge variant='secondary'>-</Badge>
			</ListItem>
			<ListItem role='row'>
				<Typography>{t('ns_inoutbound:fields.inspected_qty')}</Typography>
				<Badge variant='secondary'>-</Badge>
			</ListItem>
			<ListItem role='row'>
				<Typography>{t('ns_warehouse:fields.type_warehouse')}</Typography>
				<Badge variant='secondary'>-</Badge>
			</ListItem>
			<ListItem role='row'>
				<Typography>{t('ns_common:common_fields.remark')}</Typography>
				<Badge variant='secondary'>-</Badge>
			</ListItem>
		</List>
	)
}

const List = tw(Div)<DivProps>`grid grid-cols-5 w-full gap-y-1 gap-x-4 overflow-auto scrollbar-none`
const ListItem = tw(Div)<DivProps>`grid grid-cols-2 whitespace-nowrap gap-2`

export default IOOrderList
