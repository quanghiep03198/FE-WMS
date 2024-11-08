import { Div, Icon, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui'
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/common/utils/cn'
import { usePageContext } from '../../_contexts/-page-context'
import TableDataRow from './-order-size-row'

const OrderSizeDetailTable: React.FC = () => {
	const { t } = useTranslation()
	const { scannedSizes } = usePageContext('scannedSizes', 'scanningStatus', 'setScannedOrders', 'setScannedSizes')
	const ref = useRef(null)

	return (
		<Div className='relative h-full divide-y overflow-hidden rounded-lg border'>
			<Div
				ref={ref}
				className={cn(
					'flow-root min-h-full w-full overflow-auto rounded-lg',
					Object.keys(scannedSizes).length > 0 ? 'max-h-[75vh]' : 'max-h-none'
				)}
				id='order-size-container'>
				<Table
					className='border-separate border-spacing-0 rounded-lg'
					style={
						{
							'--sticky-col-width': '9rem'
						} as React.CSSProperties
					}>
					<TableHeader>
						<TableRow className='sticky top-0 z-20 *:bg-table-head'>
							<TableHead
								align='left'
								className='left-0 z-20 xl:sticky xl:w-[var(--sticky-col-width)] xl:min-w-[var(--sticky-col-width)]'>
								{t('ns_erp:fields.mo_no')}
							</TableHead>
							<TableHead
								align='left'
								className='z-20 border-r-0 drop-shadow-[1px_0px_hsl(var(--border))] xl:sticky xl:left-[var(--sticky-col-width)] xl:w-[var(--sticky-col-width)] xl:min-w-[var(--sticky-col-width)]'>
								{t('ns_erp:fields.shoestyle_codefactory')}
							</TableHead>
							<TableHead align='left'>Size</TableHead>
							<TableHead align='right' className='z-20 xl:sticky xl:right-12'>
								{t('ns_common:common_fields.total')}
							</TableHead>
							<TableHead align='center' className='right-0 z-20 xl:sticky xl:min-w-12'>
								-
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody className='[&_tr]:snap-start'>
						{Object.keys(scannedSizes).length > 0 ? (
							Object.entries(scannedSizes).map(([orderCode, sizeList]) => {
								return <TableDataRow key={orderCode} orderCode={orderCode} sizeList={sizeList} />
							})
						) : (
							<TableRow>
								<TableCell colSpan={5} className='group-hover:!bg-background'>
									<Div className='absolute inset-y-0 flex w-full items-center justify-center gap-x-4 text-base text-muted-foreground'>
										<Icon name='Inbox' size={40} strokeWidth={1} />
										{t('ns_common:table.no_data')}
									</Div>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</Div>
		</Div>
	)
}

export default OrderSizeDetailTable
