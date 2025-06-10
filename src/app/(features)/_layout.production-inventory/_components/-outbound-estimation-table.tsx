import { IOutboundExpectation } from '@/common/types/entities'
import { cn } from '@/common/utils/cn'
import formatIntlNumber from '@/common/utils/format-intl-number'
import {
	Div,
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
	Typography
} from '@/components/ui'
import { format } from 'date-fns'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'

type OutboundEstimationTableProps = {
	data: IOutboundExpectation[]
}

export const OutboundEstimationTable: React.FC<OutboundEstimationTableProps> = ({ data }) => {
	const { t } = useTranslation()
	const captionId = useId()

	return (
		<Div className='space-y-4 rounded-md border bg-background p-4 shadow xxl:p-6'>
			<Div className={cn('h-[20rem] overflow-y-auto !scrollbar-none')}>
				<Table className='table-fixed caption-top border-separate border-spacing-0'>
					<TableCaption id={captionId} className='sr-only'>
						{t('ns_inoutbound:description.outbound_estimation')}
					</TableCaption>
					<TableHeader className='sticky top-0 border-b'>
						<TableRow className='[&_th>span]:line-clamp-1 [&_th[align=right]>span]:ml-auto [&_th[align=right]>span]:truncate [&_th]:h-10 [&_th]:border-x-0 [&_th]:bg-table-head [&_th]:lowercase [&_th]:first-letter:uppercase'>
							<TableHead align='left' className='!uppercase'>
								<span>PO</span>
							</TableHead>
							<TableHead align='left' className='lowercase first-letter:uppercase'>
								<span>{t('ns_erp:fields.outbound_date')}</span>
							</TableHead>
							<TableHead align='right' className='lowercase first-letter:uppercase'>
								<span>{t('ns_erp:fields.order_qty')}</span>
							</TableHead>
							<TableHead align='right' className='lowercase first-letter:uppercase'>
								<span>{t('ns_erp:fields.outbound_qty')}</span>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{!Array.isArray(data) || data.length === 0 ? (
							<TableRow>
								<TableCell colSpan={4} align='center' className='py-10'>
									{t('ns_common:table.no_data')}
								</TableCell>
							</TableRow>
						) : (
							data.map((item, index) => {
								return (
									<TableRow key={index.toString()} className='[&_td]:h-10 [&_td]:border-x-0'>
										<TableCell align='left'>{item.po}</TableCell>
										<TableCell align='left'>{format(new Date(item.outbound_date), 'yyyy-MM-dd')}</TableCell>
										<TableCell align='right'>{formatIntlNumber(item.po_qty)}</TableCell>
										<TableCell align='right'>{formatIntlNumber(item.outbound_qty)}</TableCell>
									</TableRow>
								)
							})
						)}
					</TableBody>
					<TableFooter className='sticky bottom-0'>
						<TableRow className='[&_td]:h-12 [&_td]:border-x-0 [&_td]:border-t [&_td]:bg-table-head'>
							<TableCell colSpan={2} align='left' className='font-semibold'>
								{t('ns_common:common_fields.total')}
							</TableCell>
							<TableCell align='right' className='font-semibold'>
								{formatIntlNumber(data?.reduce((total, item) => total + item.po_qty, 0) ?? 0)}
							</TableCell>
							<TableCell align='right' className='font-semibold'>
								{formatIntlNumber(data?.reduce((total, item) => total + item.outbound_qty, 0) ?? 0)}
							</TableCell>
						</TableRow>
					</TableFooter>
				</Table>
			</Div>
			<Typography aria-labelledby={captionId} className='block text-center text-sm text-muted-foreground'>
				{t('ns_inoutbound:description.outbound_estimation')}
			</Typography>
		</Div>
	)
}
