import { factories } from '@/common/constants/constants'
import { IInboundHistory } from '@/common/types/entities'
import { Button, DataTable, Icon, Tooltip, Typography } from '@/components/ui'
import { createColumnHelper, Table as TTable } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Fragment, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useGetInboundHistoryQuery } from '../-hooks/use-inoutbound-history-asm'
import DataTableSummary from './data-table-summary'

const InboundHistoryTable: React.FC = () => {
	const { data, isLoading, refetch } = useGetInboundHistoryQuery()
	const { t, i18n } = useTranslation()
	const dataTableRef = useRef<TTable<IInboundHistory>>(null)
	const columnHelper = createColumnHelper<IInboundHistory>()

	useEffect(() => {
		if (dataTableRef.current) dataTableRef.current.toggleAllRowsExpanded(false)
	}, [data])

	const columns = useMemo(
		() => [
			columnHelper.group({
				id: 'inbound_history',
				header: () => (
					<Typography as='span' variant='small' className='inline-flex items-center gap-x-2 text-foreground'>
						<Icon name='History' size={20} />
						{t('ns_inoutbound:titles.inbound_history')}
					</Typography>
				),
				columns: [
					columnHelper.accessor('factory_code', {
						header: t('ns_common:common_fields.factory_code'),
						enableResizing: true,
						enableColumnFilter: true,
						enableSorting: true,
						enablePinning: true,
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
					columnHelper.accessor('brand_name', {
						header: t('ns_erp:fields.brand_name'),
						enableResizing: true,
						enableColumnFilter: true,
						enableSorting: true,
						enablePinning: true,
						filterFn: 'includesString'
					}),
					columnHelper.accessor('mo_no', {
						header: t('ns_erp:fields.mo_no'),
						enableResizing: true,
						enableColumnFilter: true,
						enableSorting: true,
						enablePinning: true,
						filterFn: 'includesString'
					}),
					columnHelper.accessor('factory_shoes_style', {
						header: t('ns_erp:fields.shoestyle_codefactory'),
						enableResizing: true,
						enableColumnFilter: true,
						enableSorting: true,
						enablePinning: true,
						filterFn: 'fuzzy',
						cell: ({ getValue }) => getValue() ?? 'Unknown'
					}),
					columnHelper.accessor('color_sn', {
						header: t('ns_erp:fields.color_sn'),
						enableColumnFilter: true,
						enableSorting: true,
						enableResizing: true,
						filterFn: 'fuzzy',
						cell: ({ getValue }) => {
							return getValue() ?? 'Unknown'
						}
					}),
					columnHelper.accessor('mo_qty', {
						header: t('ns_erp:fields.mo_qty'),
						enableColumnFilter: true,
						enableSorting: true,
						enableResizing: true,
						enablePinning: true,
						filterFn: 'inNumberRange',
						cell: ({ getValue }) => {
							return getValue() ?? 'Unknown'
						},
						meta: { align: 'right', filterVariant: 'range' }
					}),

					columnHelper.accessor('inbound_qty', {
						header: t('ns_erp:fields.inbound_qty'),
						enableColumnFilter: true,
						enableSorting: true,
						enablePinning: true,
						filterFn: 'inNumberRange',
						cell: ({ getValue }) => {
							return getValue() ?? 'Unknown'
						},
						meta: { align: 'right', filterVariant: 'range' }
					}),

					columnHelper.accessor('inbound_date', {
						header: t('ns_erp:fields.inbound_date'),
						enableColumnFilter: true,
						enableSorting: true,
						enableResizing: true,
						enablePinning: true,
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
	const orderQuantity = hasData ? Math.max(...data.map((item) => item.mo_qty)) : 0
	const accumulatedQuantity = hasData ? data.reduce((acc, curr) => acc + curr.inbound_qty, 0) : 0
	const missingQuantity = hasData ? orderQuantity - accumulatedQuantity : 0

	return (
		<DataTable
			data={data}
			loading={isLoading}
			columns={columns}
			defaultFilterOpen={true}
			enableColumnPinning={false}
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

export default InboundHistoryTable
