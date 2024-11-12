import { Div, Icon, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'

import { usePageContext } from '../../_contexts/-page-context'
import TableDataRow from './-order-size-row'

const OrderSizeDetailTable: React.FC = () => {
	const { t } = useTranslation()
	const { scannedOrders, selectedOrder } = usePageContext('scannedOrders', 'selectedOrder')

	return (
		<Div className='relative h-[60vh] min-h-full divide-y overflow-auto rounded-lg border group-data-[screen=fullscreen]/container:h-[85vh] xxl:h-[80vh]'>
			<Table
				className='border-separate border-spacing-0 rounded-[inherit]'
				style={
					{
						'--sticky-col-width': '9rem'
					} as React.CSSProperties
				}>
				<TableHeader>
					<TableRow className='sticky top-0 z-20 *:bg-table-head'>
						<TableHead
							align='left'
							className='z-20 w-[var(--sticky-col-width)] min-w-[var(--sticky-col-width)] xl:sticky xl:left-0'>
							{t('ns_erp:fields.mo_no')}
						</TableHead>
						<TableHead
							align='left'
							className='z-20 w-[var(--sticky-col-width)] min-w-[var(--sticky-col-width)] border-r-0 drop-shadow-[1px_0px_hsl(var(--border))] xl:sticky xl:left-[var(--sticky-col-width)]'>
							{t('ns_erp:fields.shoestyle_codefactory')}
						</TableHead>
						<TableHead align='left'>Size</TableHead>
						<TableHead align='right' className='xl:sticky xl:right-12 xl:z-20'>
							{t('ns_common:common_fields.total')}
						</TableHead>
						<TableHead align='center' className='xl:sticky xl:right-0 xl:z-20 xl:min-w-12'>
							-
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody className='[&_tr]:snap-start'>
					{Object.keys(scannedOrders).length > 0 ? (
						Object.entries(scannedOrders)
							.filter(([orderCode]) => {
								if (selectedOrder === 'all' || !selectedOrder) return true
								return orderCode === selectedOrder
							})
							.map(([orderCode, sizeList]) => {
								return <TableDataRow key={orderCode} orderCode={orderCode} sizeList={sizeList} />
							})
					) : (
						<TableRow>
							<TableCell colSpan={5} className='text-muted-foreground group-hover:!bg-background'>
								<Div className='text-muted-foregrounds absolute inset-0 z-0 flex w-full items-center justify-center gap-x-4 text-base sm:min-h-80'>
									<Icon name='Inbox' size={32} strokeWidth={1} />
									{t('ns_common:table.no_data')}
								</Div>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</Div>
	)
}

export default OrderSizeDetailTable
