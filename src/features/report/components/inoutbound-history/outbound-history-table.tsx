import { coalesce } from '@common/utils/common'
import formatIntlNumber from '@common/utils/format-intl-number'
import { Div, Icon, Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@components/ui'
import type { IOutboundHistory } from '@features/report/types'
import { groupBy, orderBy, sortBy } from 'lodash-es'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
	NestedCell,
	NestedCellHead,
	NestedColumn,
	NestedTable
} from '../../../../components/shared/horizontal-nested-table'
import { useGetOutboundHistoryQuery } from '../../hooks/inoutbound-history/use-inoutbound-history-request'
import EmptyHistory from './empty-history'

const OutboundHistoryTable: React.FC = () => {
	const { data, isLoading } = useGetOutboundHistoryQuery()
	const { t, i18n } = useTranslation()
	const columns = useMemo<
		Array<{
			header: string
			accessorKey: keyof IOutboundHistory
			meta: React.ThHTMLAttributes<HTMLTableCellElement>
			cell?: (value: IOutboundHistory[keyof IOutboundHistory]) => string | number | React.ReactNode
		}>
	>(
		() => [
			{ header: t('ns_erp:fields.po'), accessorKey: 'po', meta: { align: 'left' } },
			{ header: t('ns_erp:fields.brand_name'), accessorKey: 'brand_name', meta: { align: 'left' } },
			{
				header: t('ns_erp:fields.factory_shoes_style'),
				accessorKey: 'factory_shoes_style',
				meta: { align: 'left' }
			},
			{
				header: t('ns_erp:fields.cust_shoes_style'),
				accessorKey: 'cust_shoes_style',
				meta: { align: 'left' },
				cell: (value: string) => {
					if (!value) return t('ns_common:titles.unknown')
					return value
						.split('/')
						.map((part) => part.trim())
						.join('/')
				}
			},
			{ header: t('ns_erp:fields.color_sn'), accessorKey: 'color_sn', meta: { align: 'left' } },
			{
				header: t('ns_erp:fields.order_qty'),
				accessorKey: 'po_qty',
				meta: { align: 'left' },
				cell: (value) => formatIntlNumber(value)
			},
			{
				header: t('ns_erp:fields.accumulated_qty'),
				accessorKey: 'accumulated_outbound_qty',
				meta: { align: 'left' },
				cell: (value) => formatIntlNumber(value)
			},
			{
				header: t('ns_erp:fields.missing_qty'),
				accessorKey: 'missing_qty',
				meta: { align: 'left' },
				cell: (value) => formatIntlNumber(value)
			},
			{
				header: t('ns_erp:fields.progress'),
				accessorKey: 'progress',
				meta: { align: 'left', style: { minWidth: 150, maxWidth: 150 } }
			}
		],
		[i18n.language]
	)

	const outboundHistoryByDate = useMemo(() => {
		if (!data?.outbound_history) return []
		return Object.entries(
			groupBy(orderBy(data.outbound_history, 'outbound_date', 'desc'), (item) => item.outbound_date)
		)
	}, [data])

	if (isLoading)
		return (
			<Div className='text-muted-foreground grid h-20 w-full place-items-center text-center'>
				<Icon name='LoaderCircle' className='animate-spin' />
			</Div>
		)

	if (!data) return <EmptyHistory />

	return (
		<Div className='scrollbar-track-accent/50 xxl:max-h-[65vh] @container relative overflow-auto rounded-lg border'>
			<Table
				className='table-fixed [&_span]:line-clamp-1'
				style={{ '--column-width': '200px' } as React.CSSProperties}>
				<TableHeader className='sticky top-0 z-20'>
					<TableRow>
						{columns.map((column) => (
							<TableHead
								key={column.accessorKey}
								title={column.header}
								className='bg-table-row-active! text-table-head-foreground w-(--column-width) capitalize first:sticky! first:left-0 first:z-10 first:shadow-[1px_0px_var(--border)] last:sticky last:right-0 last:z-10'
								{...column.meta}>
								<span>{column.header}</span>
							</TableHead>
						))}
					</TableRow>
					<TableRow>
						{columns.map((column) => (
							<TableHead
								key={column.accessorKey}
								className='text-foreground w-(--column-width) font-normal first:sticky! first:left-0 first:z-10 first:shadow-[1px_0px_var(--border)] last:sticky last:right-0 last:z-10'
								{...column.meta}>
								<span>
									{typeof column.cell === 'function'
										? column.cell(data[column.accessorKey])
										: data[column.accessorKey]?.toString?.()}
								</span>
							</TableHead>
						))}
					</TableRow>
					<TableRow className='*:bg-table-row-active! *:capitalize'>
						<TableHead
							align='left'
							className='sticky! left-0 z-10'
							style={{ boxShadow: '1px 0px var(--border)', maxWidth: 200, minWidth: 200 }}>
							<span>{t('ns_erp:fields.outbound_date')}</span>
						</TableHead>
						<TableHead colSpan={7} align='left' className='p-0'>
							<span className='sticky left-(--column-width) block w-[calc(100cqw-10px-2*var(--column-width))] px-4 py-2 text-center'>
								{t('ns_erp:fields.daily_outbound_qty')}
							</span>
						</TableHead>
						<TableHead align='left' className='sticky! right-0 z-10'>
							<span>{t('ns_common:common_fields.total')}</span>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{outboundHistoryByDate.length > 0 ? (
						outboundHistoryByDate.map(([date, order]) => {
							const totalQty = order.reduce(
								(acc, curr) =>
									acc +
									curr.sizes.reduce((_acc, _curr) => {
										return _acc + coalesce(_curr?.qty, 0)
									}, 0),
								0
							)
							return (
								<TableRow key={date}>
									<TableCell
										align='left'
										colSpan={1}
										className='sticky left-0 z-10'
										style={{ boxShadow: '1px 0px var(--border)' }}>
										<span>{date}</span>
									</TableCell>
									<TableCell colSpan={7} className='divide-border divide-y p-0'>
										{order.map((item) => (
											<NestedTable key={item.mo_no}>
												<NestedColumn className='basis-32'>
													<NestedCell
														className='row-span-2 inline-flex items-center justify-start'
														align='left'>
														{item.mo_no}
													</NestedCell>
												</NestedColumn>
												{Array.isArray(item.sizes) &&
													item.sizes.map((size) => (
														<NestedColumn key={size.size_numcode}>
															<NestedCellHead>{size.size_numcode}</NestedCellHead>
															<NestedCell>{formatIntlNumber(size.qty)}</NestedCell>
														</NestedColumn>
													))}
											</NestedTable>
										))}
									</TableCell>
									<TableCell colSpan={1} align='left' className='sticky! right-0 z-10 font-medium'>
										<span>{formatIntlNumber(totalQty)}</span>
									</TableCell>
								</TableRow>
							)
						})
					) : (
						<TableRow>
							<TableCell colSpan={9} className='border-b-0! p-0'>
								<Div className='sticky left-0 flex max-w-[calc(100cqw-10px)] items-center justify-center gap-x-2'>
									<EmptyHistory />
								</Div>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
				<TableFooter className='sticky bottom-0 z-20 [&>tr:first-child>td]:border-t'>
					<TableRow>
						<TableCell
							colSpan={9}
							align='left'
							className='bg-table-row-active text-table-head-foreground border-b-0! p-0'>
							<Div className='sticky left-0 max-w-[calc(100cqw-10px)] px-4 py-2 text-center'>
								{t('ns_common:titles.overall')}
							</Div>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell colSpan={9} align='left' className='border-t p-0 font-normal'>
							<NestedTable className='w-full'>
								<NestedColumn className='sticky left-0 z-20 min-w-(--column-width) shadow-[1px_0px_var(--border)] *:h-9 *:capitalize'>
									<NestedCellHead>Size</NestedCellHead>
									<NestedCellHead>
										<span>{t('ns_erp:fields.mo_size_qty')}</span>
									</NestedCellHead>
									<NestedCellHead>
										<span>{t('ns_erp:fields.outbound_qty')}</span>
									</NestedCellHead>
									<NestedCellHead>
										<span>{t('ns_erp:fields.missing_qty')}</span>
									</NestedCellHead>
								</NestedColumn>
								{Array.isArray(data?.overall) &&
									sortBy(data.overall, 'size_numcode').map((item) => {
										return (
											<NestedColumn key={item.size_numcode} className='w-full *:h-9'>
												<NestedCellHead>{item.size_numcode}</NestedCellHead>
												<NestedCell>{formatIntlNumber(item?.po_size_qty)}</NestedCell>
												<NestedCell>{formatIntlNumber(item?.acc_qty)}</NestedCell>
												<NestedCell>{formatIntlNumber(item?.missing_qty)}</NestedCell>
											</NestedColumn>
										)
									})}
							</NestedTable>
						</TableCell>
					</TableRow>
				</TableFooter>
			</Table>
		</Div>
	)
}

export default OutboundHistoryTable
