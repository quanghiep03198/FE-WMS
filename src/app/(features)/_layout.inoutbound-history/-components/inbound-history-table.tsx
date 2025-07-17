import { factories } from '@/common/constants/constants'
import { IInboundHistory } from '@/common/types/entities'
import { Button, DataTable, Icon, Tooltip } from '@/components/ui'
import { createColumnHelper, Table as TTable } from '@tanstack/react-table'
import { format } from 'date-fns'
import { Fragment, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useGetInboundHistoryQuery } from '../-hooks/use-inoutbound-progress'
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
				header: t('ns_inoutbound:titles.inbound_history'),
				columns: [
					columnHelper.accessor('factory_code', {
						header: t('ns_common:common_fields.factory_code'),
						enableColumnFilter: true,
						enableSorting: true,
						enablePinning: true,
						minSize: 120,
						size: 120,
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
						enableColumnFilter: true,
						enableSorting: true,
						enablePinning: true,
						minSize: 100,
						filterFn: 'includesString'
					}),
					columnHelper.accessor('mo_no', {
						header: t('ns_erp:fields.mo_no'),
						enableColumnFilter: true,
						enableSorting: true,
						enablePinning: true,
						minSize: 100,
						filterFn: 'includesString'
					}),
					columnHelper.accessor('shoes_style_code_factory', {
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
					columnHelper.accessor('mo_qty', {
						header: t('ns_erp:fields.mo_qty'),
						enableColumnFilter: true,
						enableSorting: true,
						minSize: 100,
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
						minSize: 100,
						filterFn: 'inNumberRange',
						cell: ({ getValue }) => {
							return getValue() ?? 'Unknown'
						},
						meta: { align: 'right', filterVariant: 'range' }
					}),

					columnHelper.accessor('inbound_date', {
						header: t('ns_erp:fields.inbound_date'),
						enableColumnFilter: false,
						enableSorting: true,
						minSize: 100,
						filterFn: 'inNumberRange',
						cell: ({ getValue }) => {
							const value = getValue()
							return value ? format(value, 'yyyy-MM-dd') : 'Unknown'
						},
						meta: { align: 'left' }
					})
				]
			})
		],
		[i18n.language]
	)

	const orderQuantity = Array.isArray(data) ? Math.max(...data.map((item) => item.mo_qty)) : 0
	const accumulatedQuantity = Array.isArray(data) ? data.reduce((acc, curr) => acc + curr.inbound_qty, 0) : 0
	const missingQuantity = Array.isArray(data) ? orderQuantity - accumulatedQuantity : 0

	return (
		<DataTable
			data={data}
			loading={isLoading}
			columns={columns}
			defaultFilterOpen={true}
			enableColumnResizing={true}
			containerProps={{ style: { height: 350 } }}
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
