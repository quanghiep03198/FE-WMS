import formatIntlNumber from '@common/utils/format-intl-number'
import { NestedCell, NestedCellHead, NestedColumn, NestedTable } from '@components/shared/horizontal-nested-table'
import { Div, Icon, Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@components/ui'
import type { IOutboundHistory } from '@features/report/types'
import { isNil, sortBy } from 'lodash-es'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetOutboundHistoryQuery } from '../../hooks/inoutbound-history/use-inoutbound-history-request'
import EmptyHistory from './empty-history'

type ColumnDef<K extends keyof IOutboundHistory> = {
	header: string
	accessorKey: K
	meta?: React.ThHTMLAttributes<HTMLTableCellElement>
	cell?: (value: IOutboundHistory[K]) => string | number | React.ReactNode
}

function createColumn<K extends keyof IOutboundHistory>(col: ColumnDef<K>) {
	return col as unknown as ColumnDef<keyof IOutboundHistory>
}

const OutboundHistoryTable: React.FC = () => {
	const { data, isLoading } = useGetOutboundHistoryQuery()
	const { t, i18n } = useTranslation()

	const columns = useMemo(
		() => [
			createColumn({
				header: t('ns_erp:fields.po'),
				accessorKey: 'po',
				meta: { align: 'left' }
			}),
			createColumn({
				header: t('ns_erp:fields.brand_name'),
				accessorKey: 'brand_name',
				meta: { align: 'left' }
			}),
			createColumn({
				header: t('ns_erp:fields.factory_shoes_style'),
				accessorKey: 'factory_shoes_style',
				meta: { align: 'left' }
			}),
			createColumn({
				header: t('ns_erp:fields.cust_shoes_style'),
				accessorKey: 'cust_shoes_style',
				meta: { align: 'left' },
				cell: (value) => value || t('ns_common:titles.unknown')
			}),
			createColumn({
				header: t('ns_erp:fields.color_sn'),
				accessorKey: 'color_sn',
				meta: { align: 'left' }
			}),
			createColumn({
				header: t('ns_erp:fields.order_qty'),
				accessorKey: 'order_qty',
				meta: { align: 'left' },
				cell: (value) => formatIntlNumber(value)
			}),
			createColumn({
				header: t('ns_erp:fields.accumulated_qty'),
				accessorKey: 'total_shipped_out_qty',
				meta: { align: 'left' },
				cell: (value) => formatIntlNumber(value)
			}),
			createColumn({
				header: t('ns_erp:fields.missing_qty'),
				accessorKey: 'missing_qty',
				meta: { align: 'left' },
				cell: (value) => formatIntlNumber(value)
			}),
			createColumn({
				header: t('ns_erp:fields.progress'),
				accessorKey: 'progress',
				meta: { align: 'left', style: { minWidth: 150, maxWidth: 150 } }
			})
		],
		[i18n.language]
	)

	if (isLoading)
		return (
			<Div className='text-muted-foreground grid h-20 w-full place-items-center text-center'>
				<Icon name='LoaderCircle' className='animate-spin' />
			</Div>
		)

	if (isNil(data)) return <EmptyHistory />

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
								style={{ width: 'var(--column-width)' }}
								className='bg-table-row-active! text-table-head-foreground capitalize first:sticky! first:left-0 first:z-10 first:shadow-[1px_0px_var(--border)] last:sticky last:right-0 last:z-10'
								{...column.meta}>
								<span>{column.header}</span>
							</TableHead>
						))}
					</TableRow>
					<TableRow>
						{columns.map((column) => (
							<TableHead
								key={column.accessorKey}
								style={{ width: 'var(--column-width)' }}
								className='text-foreground font-normal first:sticky! first:left-0 first:z-10 first:shadow-[1px_0px_var(--border)] last:sticky last:right-0 last:z-10'
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
							<span
								style={{ left: 'var(--column-width)' }}
								className='sticky block w-[calc(100cqw-10px-2*var(--column-width))] px-4 py-2 text-center'>
								{t('ns_erp:fields.daily_outbound_qty')}
							</span>
						</TableHead>
						<TableHead align='left' className='sticky! right-0 z-10'>
							<span>{t('ns_common:common_fields.total')}</span>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.outbound_history.length > 0 ? (
						data.outbound_history.map((item) => {
							const totalShippedOutQty = 0

							console.log(item)

							return (
								<TableRow key={item.date}>
									<TableCell
										align='left'
										colSpan={1}
										className='sticky left-0 z-10'
										style={{ boxShadow: '1px 0px var(--border)' }}>
										<span>{item.date}</span>
									</TableCell>
									<TableCell colSpan={7} className='divide-border divide-y p-0'>
										{item.data.map((item) => (
											<NestedTable key={item.mo_no}>
												<NestedColumn className='basis-32'>
													<NestedCell className='row-span-2 inline-flex items-center justify-start text-left'>
														{item.mo_no}
													</NestedCell>
												</NestedColumn>
												{Array.isArray(item.shipping_details) &&
													item.shipping_details.map((size) => (
														<NestedColumn key={size.size_numcode}>
															<NestedCellHead>{size.size_numcode}</NestedCellHead>
															<NestedCell>{formatIntlNumber(size.shipped_out_qty)}</NestedCell>
														</NestedColumn>
													))}
											</NestedTable>
										))}
									</TableCell>
									<TableCell colSpan={1} align='left' className='sticky! right-0 z-10 font-medium'>
										<span>{formatIntlNumber(totalShippedOutQty)}</span>
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
								<NestedColumn
									style={{ minWidth: 'var(--column-width)' }}
									className='sticky left-0 z-20 shadow-[1px_0px_var(--border)] *:h-9 *:capitalize'>
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
												<NestedCell>{formatIntlNumber(item?.order_qty)}</NestedCell>
												<NestedCell>{formatIntlNumber(item?.shipped_out_qty)}</NestedCell>
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
