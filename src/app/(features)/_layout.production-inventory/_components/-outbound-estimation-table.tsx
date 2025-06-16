import { IOutboundEstimation } from '@/common/types/entities'
import { cn } from '@/common/utils/cn'
import formatIntlNumber from '@/common/utils/format-intl-number'
import {
	Collapsible,
	CollapsibleContent,
	Div,
	Icon,
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
import { Fragment, useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import SizeTable from './-size-table'

type OutboundEstimationTableProps = {
	data: IOutboundEstimation[]
}

export const OutboundEstimationTable: React.FC<OutboundEstimationTableProps> = ({ data }) => {
	const { t } = useTranslation()
	const captionId = useId()

	return (
		<Div className='space-y-4 rounded-md border bg-background p-4 shadow-sm xxl:p-6'>
			<Div className='h-[20rem] overflow-y-auto rounded-sm !scrollbar-none'>
				<Table className='table-fixed caption-top border-separate border-spacing-0'>
					<TableCaption id={captionId} className='sr-only'>
						{t('ns_inoutbound:description.outbound_estimation')}
					</TableCaption>
					<TableHeader className='sticky top-0 z-10 border-b'>
						<TableRow className='[&_th>span]:line-clamp-1 [&_th[align=right]>span]:ml-auto [&_th[align=right]>span]:truncate [&_th]:h-10 [&_th]:border-x-0 [&_th]:bg-table-head [&_th]:lowercase [&_th]:first-letter:uppercase'>
							<TableHead align='center' className='w-14'>
								<span className='sr-only'>{t('ns_common:common_fields.actions')}</span>
							</TableHead>
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
								return <TableRowData key={index.toString()} data={item} />
							})
						)}
					</TableBody>
					<TableFooter className='sticky bottom-0'>
						<TableRow className='[&_td]:h-10 [&_td]:border-x-0 [&_td]:border-t [&_td]:bg-table-head'>
							<TableCell colSpan={3} align='left' className='font-semibold'>
								{t('ns_common:common_fields.total')}
							</TableCell>
							<TableCell align='right' className='font-semibold'>
								{formatIntlNumber(data?.reduce((acc, curr) => acc + curr.po_qty, 0) ?? 0)}
							</TableCell>
							<TableCell align='right' className='font-semibold'>
								{formatIntlNumber(data?.reduce((acc, curr) => acc + curr.outbound_qty, 0) ?? 0)}
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

const TableRowData: React.FC<{ data: IOutboundEstimation }> = ({ data }) => {
	const [open, setOpen] = useState<boolean>(false)

	return (
		<Fragment>
			<TableRow className={cn('[&_td]:h-10 [&_td]:border-x-0')}>
				<TableCell align='center' className='relative'>
					<button className='absolute inset-0 z-0' onClick={() => setOpen(!open)}>
						<Icon
							name='ChevronRight'
							className={cn(
								'inline-flex items-center justify-center transition-transform duration-200',
								open ? 'rotate-90' : 'rotate-0'
							)}
						/>
					</button>
				</TableCell>
				<TableCell align='left'>{data.po}</TableCell>
				<TableCell align='left'>{format(new Date(data.outbound_date), 'yyyy-MM-dd')}</TableCell>
				<TableCell align='right'>{formatIntlNumber(data.po_qty)}</TableCell>
				<TableCell align='right'>{formatIntlNumber(data.outbound_qty)}</TableCell>
			</TableRow>
			<TableRow>
				<TableCell
					colSpan={5}
					className={cn('p-0', !open ? 'border-none shadow-none' : 'shadow-[inset_0_0px_4px_#17171725]')}>
					<Collapsible open={open} data-state={open ? 'open' : 'closed'}>
						<CollapsibleContent
							className='overflow-auto bg-secondary/50 transition-none data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down'
							style={{ scrollbarGutter: 'stable' }}>
							<Div className='p-4'>
								<SizeTable data={data.inv_sizes} />
							</Div>
						</CollapsibleContent>
					</Collapsible>
				</TableCell>
			</TableRow>
		</Fragment>
	)
}
