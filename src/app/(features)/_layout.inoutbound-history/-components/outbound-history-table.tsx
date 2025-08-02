import { IOutboundHistory } from '@/common/types/entities'
import formatIntlNumber from '@/common/utils/format-intl-number'
import { Button, DataTable, Icon, Tooltip, Typography } from '@/components/ui'
import { createColumnHelper, Table } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Fragment, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useGetOutboundHistoryQuery } from '../-hooks/use-inoutbound-history-asm'
import DataTableSummary from './data-table-summary'

const OutboundHistoryTable: React.FC = () => {
	const { data, isLoading, refetch } = useGetOutboundHistoryQuery()
	const { t, i18n } = useTranslation()
	const dataTableRef = useRef<Table<IOutboundHistory>>(null)
	const columnHelper = createColumnHelper<IOutboundHistory>()

	useEffect(() => {
		if (dataTableRef.current) dataTableRef.current.toggleAllRowsExpanded(false)
	}, [data])

	const columns = useMemo(
		() => [
			columnHelper.group({
				id: 'outbound_history',
				header: () => (
					<Typography variant='small' className='inline-flex items-center gap-x-2'>
						<Icon name='History' size={20} />
						{t('ns_inoutbound:titles.outbound_history')}
					</Typography>
				),
				enableGrouping: true,
				columns: [
					columnHelper.accessor('brand_name', {
						header: t('ns_erp:fields.brand_name'),
						enableColumnFilter: true,
						enableSorting: true,
						enablePinning: true,
						minSize: 100,
						filterFn: 'includesString'
					}),
					columnHelper.accessor('po', {
						header: t('ns_erp:fields.po'),
						enableColumnFilter: true,
						enableSorting: true,
						enablePinning: true,
						minSize: 100,
						filterFn: 'includesString'
					}),
					columnHelper.accessor('factory_shoes_style', {
						header: t('ns_erp:fields.shoestyle_codefactory'),
						enableColumnFilter: true,
						enableSorting: true,
						filterFn: 'fuzzy',
						minSize: 100,
						cell: ({ getValue }) => getValue() ?? 'Unknown'
					}),
					columnHelper.accessor('color_sn', {
						header: t('ns_erp:fields.color_sn'),
						enableColumnFilter: true,
						enableSorting: true,
						minSize: 100,
						filterFn: 'fuzzy',
						cell: ({ getValue }) => {
							return getValue() ?? 'Unknown'
						}
					}),
					columnHelper.accessor('po_qty', {
						header: t('ns_erp:fields.order_qty'),
						enableColumnFilter: true,
						enableSorting: true,
						minSize: 100,
						filterFn: 'inNumberRange',
						cell: ({ getValue }) => {
							return formatIntlNumber(getValue())
						},
						meta: { align: 'right', filterVariant: 'range' }
					}),
					columnHelper.accessor('outbound_qty', {
						header: t('ns_erp:fields.outbound_qty'),
						enableColumnFilter: true,
						enableSorting: true,
						minSize: 100,
						filterFn: 'inNumberRange',
						cell: ({ getValue }) => {
							return formatIntlNumber(getValue())
						},
						meta: { align: 'right', filterVariant: 'range' }
					}),
					columnHelper.accessor('outbound_date', {
						header: t('ns_erp:fields.outbound_date'),
						enableColumnFilter: true,
						enableSorting: true,
						minSize: 200,
						filterFn: 'inDateRange',
						cell: ({ getValue }) => {
							const value = getValue()
							return value ? format(value, 'yyyy-MM-dd') : 'Unknown'
						},
						meta: { align: 'left', filterVariant: 'date' }
					})
				]
			})
		],
		[i18n.language]
	)

	const hasData = Array.isArray(data) && data.length > 0
	const orderQuantity = hasData ? Math.max(...data.map((item) => item.po_qty)) : 0
	const accumulatedQuantity = hasData ? data.reduce((acc, curr) => acc + curr.outbound_qty, 0) : 0
	const missingQuantity = hasData ? orderQuantity - accumulatedQuantity : 0

	return (
		<DataTable
			data={data}
			loading={isLoading}
			columns={columns}
			defaultFilterOpen={true}
			enableColumnResizing={true}
			containerProps={{ style: { height: 380 } }}
			toolbarProps={{
				slotRight: () => (
					<Fragment>
						<Tooltip message={`${t('ns_common:actions.export')} Excel`} triggerProps={{ asChild: true }}>
							<Button
								size='icon'
								variant='outline'
								disabled={!data || data.length === 0}
								onClick={() => toast('Alert', { description: t('ns_common:errors.503_message') })}>
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
			footerProps={{
				slot: () => <DataTableSummary {...{ isLoading, accumulatedQuantity, missingQuantity }} />
			}}
		/>
	)
}

export default OutboundHistoryTable
