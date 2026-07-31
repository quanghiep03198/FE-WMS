import { coalesce } from '@common/utils/common'
import formatIntlNumber from '@common/utils/format-intl-number'
import { NestedCell, NestedCellHead, NestedColumn, NestedTable } from '@components/shared/horizontal-nested-table'
import { Div, Icon, Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@components/ui'
import type { IInboundHistory } from '@features/report/types'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetInboundHistoryQuery } from '../../hooks/inoutbound-history/use-inoutbound-history-request'
import EmptyHistory from './empty-history'

const InboundHistoryTable: React.FC = () => {
	const { data, isLoading } = useGetInboundHistoryQuery()
	const { t, i18n } = useTranslation()
	const columns = useMemo<
		Array<{
			header: string
			accessorKey: keyof IInboundHistory
			meta: React.ThHTMLAttributes<HTMLTableCellElement>
			cell?: (value: IInboundHistory[keyof IInboundHistory]) => string | number | React.ReactNode
		}>
	>(
		() => [
			{ header: t('ns_erp:fields.mo_no'), accessorKey: 'mo_no', meta: { align: 'left' } },
			{ header: t('ns_erp:fields.brand_name'), accessorKey: 'brand_name', meta: { align: 'left' } },
			{
				header: t('ns_erp:fields.factory_shoes_style'),
				accessorKey: 'factory_shoes_style',
				meta: { align: 'left' }
			},

			{ header: t('ns_erp:fields.color_sn'), accessorKey: 'color_sn', meta: { align: 'left' } },
			{
				header: t('ns_erp:fields.order_qty'),
				accessorKey: 'total_target_qty',
				meta: { align: 'left' },
				cell: (value) => formatIntlNumber(value)
			},
			{
				header: t('ns_erp:fields.accumulated_qty'),
				accessorKey: 'accumulated_inbound_qty',
				meta: { align: 'left' },
				cell: (value) => formatIntlNumber(value)
			},
			{
				header: t('ns_erp:fields.recalled_qty'),
				accessorKey: 'recalled_qty',
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

	if (isLoading)
		return (
			<Div className='text-muted-foreground grid h-20 w-full place-items-center text-center'>
				<Icon name='LoaderCircle' className='animate-spin' />
			</Div>
		)

	if (!data) return <EmptyHistory />

	return (
		<Div className='scrollbar-track-accent/50 xxl:max-h-[65vh] @container relative max-h-150 overflow-auto rounded-lg border'>
			<Table
				className='table-fixed [--column-width:200px] [&_span]:line-clamp-1'
				style={{ '--column-width': '200px' } as React.CSSProperties}>
				<TableHeader className='sticky top-0 z-20'>
					<TableRow>
						{columns.map((column) => (
							<TableHead
								key={column.accessorKey}
								title={column.header}
								className='bg-table-row-active! text-table-head-foreground w-[var(--column-width)] capitalize first:sticky! first:left-0 first:z-10 first:shadow-[1px_0px_var(--border)] last:sticky last:right-0 last:z-10'
								{...column.meta}>
								<span>{column.header}</span>
							</TableHead>
						))}
					</TableRow>
					<TableRow>
						{columns.map((column) => (
							<TableHead
								key={column.accessorKey}
								className='text-foreground w-[var(--column-width)] font-normal first:sticky! first:left-0 first:z-10 first:shadow-[1px_0px_var(--border)] last:sticky last:right-0 last:z-10'
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
							<span>{t('ns_erp:fields.inbound_date')}</span>
						</TableHead>
						<TableHead colSpan={7} align='left' className='p-0'>
							<span className='sticky left-(--column-width) block w-[calc(100cqw-10px-2*var(--column-width))] px-4 py-2 text-center'>
								{t('ns_erp:fields.daily_inbound_qty')}
							</span>
						</TableHead>

						<TableHead align='left' className='sticky! right-0 z-10'>
							<span>{t('ns_common:common_fields.total')}</span>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.daily_inbound_history.length > 0 ? (
						data.daily_inbound_history.map((item) => {
							const totalQty = Object.values(item.inventory_variation).reduce(
								(acc, curr) =>
									acc +
									coalesce(curr?.stocked_in_qty, 0) -
									coalesce(curr?.total_recall_tx, 0) +
									coalesce(curr?.total_return_tx, 0),
								0
							)
							return (
								<TableRow key={item.date}>
									<TableCell
										align='left'
										colSpan={1}
										className='sticky left-0 z-10'
										style={{ boxShadow: '1px 0px var(--border)' }}>
										<span>{item.date}</span>
									</TableCell>
									<TableCell colSpan={7} className='p-0'>
										<NestedTable>
											{Object.entries(item.inventory_variation)
												.sort((a, b) => a[0].localeCompare(b[0]))
												.map(([size, variation]) => (
													<NestedColumn key={size} className='*:h-9'>
														<NestedCellHead>{size}</NestedCellHead>
														<NestedCell>
															{formatIntlNumber(
																variation?.stocked_in_qty -
																	variation?.total_recall_tx +
																	variation?.total_return_tx
															)}
														</NestedCell>
													</NestedColumn>
												))}
										</NestedTable>
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
								<NestedColumn className='sticky left-0 z-20 min-w-[var(--column-width)] shadow-[1px_0px_var(--border)] *:h-9 *:capitalize'>
									<NestedCellHead>Size</NestedCellHead>
									<NestedCellHead>
										<span>{t('ns_erp:fields.mo_size_qty')}</span>
									</NestedCellHead>
									<NestedCellHead>
										<span>{t('ns_erp:fields.inbound_qty')}</span>
									</NestedCellHead>
									<NestedCellHead>
										<span>{t('ns_erp:fields.recalled_qty')}</span>
									</NestedCellHead>
									<NestedCellHead>
										<span>{t('ns_erp:fields.missing_qty')}</span>
									</NestedCellHead>
								</NestedColumn>
								{}
								{Object.entries(data.inventory_variation).map(([size, variation]) => {
									const targetQty = coalesce(variation?.target_qty, 0)
									const stockedInQty =
										coalesce(variation?.stocked_in_qty, 0) -
										coalesce(variation?.total_recall_tx, 0) +
										coalesce(variation?.total_return_tx, 0)
									const recalledQty =
										coalesce(variation?.total_recall_tx, 0) - coalesce(variation?.total_return_tx, 0)
									const missingQty = targetQty - stockedInQty
									return (
										<NestedColumn key={size} className='w-full *:h-9'>
											<NestedCellHead>{size}</NestedCellHead>
											<NestedCell>{formatIntlNumber(targetQty)}</NestedCell>
											<NestedCell>{formatIntlNumber(stockedInQty)}</NestedCell>
											<NestedCell>{formatIntlNumber(recalledQty)}</NestedCell>
											<NestedCell>{formatIntlNumber(missingQty)}</NestedCell>
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

export default InboundHistoryTable
