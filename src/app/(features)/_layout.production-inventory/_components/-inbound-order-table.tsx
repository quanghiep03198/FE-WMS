import { IInboundInventory } from '@/common/types/entities'
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
import React, { useId } from 'react'
import { useTranslation } from 'react-i18next'

type InboundOrderTableProps = {
	data: Array<IInboundInventory>
}

const InboundOrderTable: React.FC<InboundOrderTableProps> = ({ data }) => {
	const { t } = useTranslation()
	const captionId = useId()

	const isEmpty = !Array.isArray(data) || data.length === 0

	return (
		<Div className='space-y-4 rounded-md border p-4 shadow xxl:p-6'>
			<Div
				className={cn(
					'flex h-[20rem] flex-col items-center overflow-auto !scrollbar-none',
					isEmpty ? 'items-center' : 'items-start'
				)}>
				<Table className='w-full table-fixed border-separate border-spacing-0'>
					<TableCaption id={captionId} className='sr-only'>
						Inbound orders
					</TableCaption>
					<TableHeader className='sticky top-0 border-b'>
						<TableRow className='[&_th>span]:line-clamp-1 [&_th[align=right]>span]:ml-auto [&_th[align=right]>span]:truncate [&_th]:h-10 [&_th]:border-x-0 [&_th]:bg-table-head [&_th]:lowercase [&_th]:first-letter:uppercase'>
							<TableHead align='left'>
								<span title={t('ns_erp:fields.mo_no')}>{t('ns_erp:fields.mo_no')}</span>
							</TableHead>
							<TableHead align='right'>
								<span title={t('ns_erp:fields.mo_qty')}>{t('ns_erp:fields.mo_qty')}</span>
							</TableHead>
							<TableHead align='right'>
								<span title={t('ns_erp:fields.inbound_qty')}>{t('ns_erp:fields.inbound_qty')}</span>
							</TableHead>
							<TableHead align='right'>
								<span title={t('ns_erp:fields.inspected_qty')}>{t('ns_erp:fields.inspected_qty')}</span>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody className='divide-y'>
						{isEmpty ? (
							<TableRow>
								<TableCell colSpan={4} align='center' className='py-10'>
									{t('ns_common:table.no_data')}
								</TableCell>
							</TableRow>
						) : (
							data.map((item, index) => {
								return (
									<TableRow key={index.toString()} className='[&>td]:h-10 [&_td]:border-x-0'>
										<TableCell>{item.mo_no}</TableCell>
										<TableCell align='right'>{formatIntlNumber(item.mo_qty)}</TableCell>
										<TableCell align='right'>{formatIntlNumber(item.inbound_qty)}</TableCell>
										<TableCell align='right'>{formatIntlNumber(item.inspected_qty)}</TableCell>
									</TableRow>
								)
							})
						)}
					</TableBody>
					<TableFooter className='sticky bottom-0'>
						<TableRow className='divide-x-0 [&_td>span]:line-clamp-1 [&_td[align=right]>span]:ml-auto [&_td[align=right]>span]:truncate [&_td]:h-12 [&_td]:border-t [&_td]:bg-table-head [&_td]:lowercase [&_td]:first-letter:uppercase'>
							<TableCell align='left' className='font-semibold'>
								{t('ns_common:common_fields.total')}
							</TableCell>
							<TableCell align='right' className='font-semibold'>
								{formatIntlNumber(data?.reduce((total, item) => total + item.mo_qty, 0) ?? 0)}
							</TableCell>
							<TableCell align='right' className='font-semibold'>
								{formatIntlNumber(data?.reduce((total, item) => total + item.inbound_qty, 0) ?? 0)}
							</TableCell>
							<TableCell align='right' className='font-semibold'>
								{formatIntlNumber(data?.reduce((total, item) => total + item.inspected_qty, 0) ?? 0)}
							</TableCell>
						</TableRow>
					</TableFooter>
				</Table>
			</Div>
			<Typography aria-labelledby={captionId} className='block text-center text-sm text-muted-foreground'>
				{t('ns_inoutbound:description.inbound_directive')}
			</Typography>
		</Div>
	)
}

export default InboundOrderTable
