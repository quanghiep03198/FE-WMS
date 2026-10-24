import { coalesce } from '@common/utils/common'
import formatIntlNumber from '@common/utils/format-intl-number'
import { Div } from '@components/customs/div'
import { NestedCell, NestedCellHead, NestedColumn, NestedTable } from '@components/shared/horizontal-nested-table'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@components/ui/dialog'
import { Icon } from '@components/ui/icon'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@components/ui/table'
import type { IInboundHistory } from '@features/report/types'
import { useResetState } from 'ahooks'
import { isNil, sortBy } from 'lodash-es'
import { Fragment, useId, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { useGetInboundHistoryQuery } from '../../hooks/inoutbound-history/use-inoutbound-history-request'
import EmptyHistory from './empty-history'

const InboundHistoryTable: React.FC = () => {
	const { data, isLoading } = useGetInboundHistoryQuery()
	const [selectedRow, setSelectedRow, resetSelectedRow] = useResetState<ArrayElement<
		IInboundHistory['daily_inbound_history']
	> | null>(null)
	const { t, i18n } = useTranslation()
	const dialogTriggerId = useId()
	const columns = useMemo<
		Array<{
			header: string
			accessorKey: keyof IInboundHistory
			meta: React.ThHTMLAttributes<HTMLTableCellElement>
			cell?: (value: IInboundHistory[keyof IInboundHistory]) => string | number | React.ReactNode
		}>
	>(
		() => [
			{
				header: t('ns_erp:fields.mo_no'),
				accessorKey: 'mo_no',
				meta: { align: 'left' }
			},
			{
				header: t('ns_erp:fields.brand_name'),
				accessorKey: 'brand_name',
				meta: { align: 'left' }
			},
			{
				header: t('ns_erp:fields.cust_shoes_style'),
				accessorKey: 'cust_shoes_style',
				meta: { align: 'left' }
			},
			{
				header: t('ns_erp:fields.factory_shoes_style'),
				accessorKey: 'factory_shoes_style',
				meta: { align: 'left' }
			},
			{ header: t('ns_erp:fields.color_sn'), accessorKey: 'color_sn', meta: { align: 'left' } },
			{
				header: t('ns_erp:fields.order_qty'),
				accessorKey: 'order_qty',
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
				meta: { align: 'left' }
			}
		],
		[i18n.language]
	)

	const isSomeRowExpanded =
		!isNil(data) &&
		!isNil(selectedRow) &&
		data.daily_inbound_history.some((history) => history.date === selectedRow.date)

	if (isLoading)
		return (
			<Div className='text-muted-foreground grid h-20 w-full place-items-center text-center'>
				<Icon className='animate-spin' name='LoaderCircle' />
			</Div>
		)

	if (!data) return <EmptyHistory />

	return (
		<Fragment>
			<Div className='scrollbar-track-accent/50 xxl:max-h-[65vh] @container relative max-h-150 scrollbar-thin overflow-auto rounded-lg border'>
				<Table
					className='table-fixed [&_span]:line-clamp-1'
					style={{ '--column-width': '200px' } as React.CSSProperties}>
					<TableHeader className='sticky top-0 z-20'>
						<TableRow>
							{columns.map((column) => (
								<TableHead
									className='bg-table-row-active! text-table-head-foreground capitalize first:sticky! first:left-0 first:z-10 first:shadow-[1px_0px_var(--border)] last:sticky last:right-0 last:z-10'
									key={column.accessorKey}
									style={{ width: 'var(--column-width)' }}
									title={column.header}
									{...column.meta}>
									<span>{column.header}</span>
								</TableHead>
							))}
						</TableRow>
						<TableRow>
							{columns.map((column) => (
								<TableHead
									className='text-foreground font-normal first:sticky! first:left-0 first:z-10 first:shadow-[1px_0px_var(--border)] last:sticky! last:right-0 last:z-10'
									key={column.accessorKey}
									style={{ width: 'var(--column-width)' }}
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
								colSpan={1}
								style={{ boxShadow: '1px 0px var(--border)', maxWidth: 200, minWidth: 200 }}>
								<span>{t('ns_erp:fields.inbound_date')}</span>
							</TableHead>
							<TableHead align='left' className='p-0' colSpan={8}>
								<span className='sticky left-(--column-width) block w-[calc(100cqw-10px-2*var(--column-width))] px-4 py-2 text-center'>
									{t('ns_erp:fields.daily_inbound_qty')}
								</span>
							</TableHead>
							<TableHead align='left' className='sticky! right-0 z-10' colSpan={1}>
								<span>{t('ns_erp:fields.progress')}</span>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.daily_inbound_history.length > 0 ? (
							data.daily_inbound_history.map((item) => {
								const totalQty = Object.values(item.size_ledger).reduce(
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
											className='group/cell sticky left-0 z-10'
											colSpan={1}
											style={{ boxShadow: '1px 0px var(--border)' }}>
											<Div className='flex items-center gap-x-2'>
												<label
													className='inline-flex cursor-pointer items-center gap-x-3'
													htmlFor={dialogTriggerId}
													onClick={() => {
														setSelectedRow(item)
													}}>
													{item.date}
													<Icon
														className='opacity-0 transition-opacity duration-200 group-hover/cell:opacity-100'
														name='SquareArrowOutUpRight'
														size={14}
													/>
												</label>
											</Div>
										</TableCell>
										<TableCell className='p-0' colSpan={8}>
											<NestedTable>
												{Object.entries(item.size_ledger)
													.toSorted((a, b) => Number.parseFloat(a[0]) - Number.parseFloat(b[0]))
													.map(([size, variation]) => (
														<NestedColumn className='*:h-9' key={size}>
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
										<TableCell align='left' className='sticky! right-0 z-10 font-medium' colSpan={1}>
											<span>{formatIntlNumber(totalQty)}</span>
										</TableCell>
									</TableRow>
								)
							})
						) : (
							<TableRow>
								<TableCell className='border-b-0! p-0' colSpan={10}>
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
								align='left'
								className='bg-table-row-active text-table-head-foreground border-b-0! p-0'
								colSpan={10}>
								<Div className='sticky left-0 max-w-[calc(100cqw-10px)] px-4 py-2 text-center'>
									{t('ns_common:titles.overall')}
								</Div>
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell align='left' className='border-t p-0 font-normal' colSpan={10}>
								<NestedTable className='w-full'>
									<NestedColumn
										className='sticky left-0 z-20 shadow-[1px_0px_var(--border)] *:h-9 *:capitalize'
										style={{ minWidth: 'var(--column-width)' }}>
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
									{Object.entries(data.size_ledger)
										.toSorted((a, b) => Number.parseFloat(a[0]) - Number.parseFloat(b[0]))
										.map(([size, variation]) => {
											const targetQty = coalesce(variation?.order_qty, 0)
											const stockedInQty = coalesce(variation?.stocked_in_qty, 0)
											const recalledQty =
												coalesce(variation?.total_recall_tx, 0) - coalesce(variation?.total_return_tx, 0)
											const missingQty = targetQty - (stockedInQty - recalledQty)
											return (
												<NestedColumn className='w-full *:h-9' key={size}>
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
			{createPortal(
				<Dialog
					onOpenChange={(open) => {
						if (!open) resetSelectedRow()
					}}>
					<DialogTrigger className='hidden' id={dialogTriggerId} />
					<DialogContent className='max-w-8xl'>
						<DialogTitle>{t('ns_inoutbound:titles.inbound_history')}</DialogTitle>
						<DialogDescription>
							{selectedRow?.mo_no} ({selectedRow?.date})
						</DialogDescription>
						<Div className='scrollbar-track-accent/20 @container h-full max-h-125 scrollbar-thin overflow-y-scroll text-sm'>
							<Table className='w-full table-fixed' style={{ '--col-width': '160px' } as React.CSSProperties}>
								<TableHeader className='sticky top-0 z-20'>
									<TableRow className='*:bg-table-head'>
										<TableHead
											align='left'
											className='whitespace-nowrap'
											style={{ width: 'var(--col-width)' }}>
											{t('ns_common:common_fields.created_at')}
										</TableHead>
										<TableHead
											align='left'
											className='whitespace-nowrap'
											style={{ width: 'var(--col-width)' }}>
											{t('ns_erp:fields.assembly_line')}
										</TableHead>
										<TableHead
											align='left'
											className='whitespace-nowrap'
											style={{ width: 'var(--col-width)' }}>
											{t('ns_warehouse:fields.storage_name')}
										</TableHead>
										<TableHead className='w-full p-0'>
											<span className='sticky left-(--column-width) block w-[calc(100cqw-10px-2*var(--column-width))] px-4 py-2 text-center'>
												{t('ns_erp:fields.daily_inbound_qty')}
											</span>
										</TableHead>
										<TableHead
											align='left'
											className='whitespace-nowrap'
											style={{ width: 'var(--col-width)' }}>
											{t('ns_common:common_fields.total')}
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{isSomeRowExpanded &&
										Array.isArray(selectedRow?.transaction_history) &&
										Array.isArray(selectedRow.transaction_history) &&
										sortBy(selectedRow.transaction_history, (item) => item.time).map((tx) => {
											const totalQty = Object.values(tx.size_ledger).reduce(
												(acc, curr) =>
													acc + (curr.stocked_in_qty - curr.total_recall_tx + curr.total_return_tx),
												0
											)
											const isStockedIn = totalQty > 0
											return (
												<TableRow aria-disabled={tx.voided} key={tx.time}>
													<TableCell
														className='sticky left-0 z-10 w-fit'
														style={{ boxShadow: '1px 0px hsl(var(--border))' }}>
														{tx.time}
													</TableCell>
													<TableCell
														align='left'
														aria-invalid={!tx.assembly_line}
														className='aria-disabled:text-muted-foreground aria-invalid:text-destructive aria-invalid:content-["-"]'>
														{isStockedIn && tx.assembly_line?.name
															? tx.assembly_line?.name[i18n.language]
															: '-'}
													</TableCell>
													<TableCell>
														{isStockedIn && tx.storage_location?.name
															? tx.storage_location?.name[i18n.language]
															: '-'}
													</TableCell>
													<TableCell className='w-full p-0'>
														<NestedTable>
															{Object.entries(tx.size_ledger)
																.sort(([size1], [size2]) =>
																	size1.localeCompare(size2, 'en-US', { numeric: true })
																)
																.map(([size, ledger]) => (
																	<NestedColumn className='*:h-9' key={size} role='grid'>
																		<NestedCellHead role='gridcell'>{size}</NestedCellHead>
																		<NestedCell role='gridcell'>
																			{formatIntlNumber(
																				ledger.stocked_in_qty -
																					ledger.total_recall_tx +
																					ledger.total_return_tx
																			)}
																		</NestedCell>
																	</NestedColumn>
																))}
														</NestedTable>
													</TableCell>
													<TableCell align='left' className='sticky right-0 z-10 font-medium'>
														<span>{formatIntlNumber(totalQty)}</span>
													</TableCell>
												</TableRow>
											)
										})}
								</TableBody>
							</Table>
						</Div>
					</DialogContent>
				</Dialog>,
				document.body
			)}
		</Fragment>
	)
}

export default InboundHistoryTable
