import { IPurchaseOrderDetail } from '@/common/types/entities'
import { DataTable, Div, Icon, Typography } from '@/components/ui'

import { FALLBACK_VALUE } from '@/common/constants/constants'
import { createColumnHelper } from '@tanstack/react-table'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { usePurchaseOrderDetailQuery } from '../-hooks/use-po-detail-asm'
import PlaceHolderItems from '../../-components/-shared/placeholder-items'
import ReportTableSummary from './report-table-summary'

const DataSection: React.FC = () => {
	const { t, i18n } = useTranslation()

	const { data, isLoading } = usePurchaseOrderDetailQuery()

	const columnHelper = createColumnHelper<IPurchaseOrderDetail>()

	const columns = useMemo(
		() => [
			columnHelper.accessor('po', { header: t('ns_erp:fields.po'), enableSorting: false, enablePinning: true }),
			columnHelper.accessor('mo_no', {
				header: t('ns_erp:fields.mo_no'),
				enableSorting: true,
				enablePinning: true
			}),
			columnHelper.accessor('brand_name', { header: t('ns_erp:fields.brand_name'), enableSorting: false }),
			columnHelper.accessor('shoes_style', {
				header: t('ns_erp:fields.shoestyle_codefactory'),
				enableSorting: false
			}),
			columnHelper.accessor('color_sn', { header: t('ns_erp:fields.color_sn'), enableSorting: false }),
			columnHelper.accessor('ship_id', {
				header: t('ns_erp:fields.shipping_id'),
				enableSorting: false,
				cell: ({ getValue }) => getValue() ?? FALLBACK_VALUE
			}),
			columnHelper.accessor('ship_dest_country', {
				header: t('ns_erp:fields.shipping_destination'),
				enableSorting: false,
				cell: ({ getValue }) => getValue() ?? FALLBACK_VALUE
			}),
			columnHelper.accessor('ship_type', {
				header: t('ns_erp:fields.shipping_type'),
				enableSorting: false,
				cell: ({ getValue }) => getValue() ?? FALLBACK_VALUE
			}),
			columnHelper.accessor('size_numcode', {
				id: 'size_numcode',
				header: 'Size',
				enableSorting: true,
				enablePinning: true
			}),
			columnHelper.accessor('qty', {
				id: 'qty',
				header: t('ns_erp:fields.po_size_qty'),
				enableSorting: true,
				enablePinning: true
			})
		],
		[i18n.language]
	)

	if (isLoading)
		return (
			<Div className='mx-auto flex h-80 max-w-4xl items-center justify-center gap-x-2'>
				<Icon name='LoaderCircle' className='animate-[spin_1s_linear_infinite]' />
				<Typography variant='small'>{t('ns_common:status.loading')}</Typography>
			</Div>
		)

	if (!data)
		return (
			<Div className='mx-auto flex h-80 max-w-4xl flex-col items-center justify-center gap-y-2 rounded-lg border-2 border-dashed bg-background p-6 text-center text-muted-foreground'>
				<PlaceHolderItems />
				<Typography className='font-medium'>{t('ns_common:table.no_data')}</Typography>
				<Typography variant='small' color='muted' className='mx-auto max-w-xl text-pretty text-center'>
					{t('ns_erp:descriptions.no_purchase_order_found')}
				</Typography>
			</Div>
		)

	return (
		<DataTable
			columns={columns}
			data={data}
			loading={isLoading}
			border='bottom-only'
			toolbarProps={{ override: true, render: () => null }}
			enableSorting={true}
			enableColumnPinning={true}
			initialState={{
				pagination: { pageIndex: 0, pageSize: 50 },
				columnPinning: {
					left: ['po', 'mo_no'],
					right: ['size_numcode', 'qty']
				}
			}}
			containerProps={{ className: 'h-96' }}
			footerProps={{
				slot: () => (
					<Div className='flex w-full items-center justify-between p-2 md:flex-col'>
						<ReportTableSummary data={data} />
					</Div>
				)
			}}
		/>
	)
}

export default DataSection
