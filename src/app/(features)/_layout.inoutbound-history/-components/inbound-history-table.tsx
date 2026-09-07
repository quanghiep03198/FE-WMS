import type { IInboundHistory } from '@/common/types/entities'
import { coalesce } from '@/common/utils/common'
import formatIntlNumber from '@/common/utils/format-intl-number'
import {
	Collapsible,
	CollapsibleContent,
	Div,
	Icon,
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow
} from '@/components/ui'
import { orderBy, sortBy } from 'lodash-es'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetInboundHistoryQuery } from '../-hooks/use-inoutbound-history-asm'
import { NestedCell, NestedCellHead, NestedColumn, NestedTable } from '../../-components/shared/horizontal-nested-table'
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
			{ header: t('ns_erp:fields.color_sn'), accessorKey: 'color', meta: { align: 'left' } },
			{
				header: t('ns_erp:fields.order_qty'),
				accessorKey: 'mo_qty',
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

	// const inboundHistoryByDate = useMemo(() => {
	// 	if (!data) return []
	// 	return Object.entries(
	// 		groupBy(orderBy(data.daily_inbound_history, 'inbound_date', 'desc'), (item) => item.inbound_date)
	// 	)
	// }, [data])

	const inboundHistoryBySize = useMemo(() => {
		if (!data) return []
		return orderBy(data.inbound_history_by_size, 'size_numcode', 'asc')
	}, [data])

	if (isLoading)
		return (
			<Div className='grid h-20 w-full place-items-center text-center text-muted-foreground'>
				<Icon name='LoaderCircle' className='animate-spin' />
			</Div>
		)

	if (!data) return <EmptyHistory />

	return (
		<Div className='relative max-h-[600px] overflow-auto rounded-lg border scrollbar-track-accent/50 @container xxl:max-h-[65vh]'>
			<Table
				className='table-fixed [&_span]:line-clamp-1'
				style={{ '--column-width': '200px' } as React.CSSProperties}>
				<TableHeader className='sticky top-0 z-20'>
					<TableRow>
						{columns.map((column) => (
							<TableHead
								key={column.accessorKey}
								title={column.header}
								className='w-[var(--column-width)] !bg-table-row-active capitalize text-table-head-foreground first:!sticky first:left-0 first:z-10 first:shadow-[1px_0px_hsl(var(--border))] last:sticky last:right-0 last:z-10'
								{...column.meta}>
								<span>{column.header}</span>
							</TableHead>
						))}
					</TableRow>
					<TableRow>
						{columns.map((column) => (
							<TableHead
								key={column.accessorKey}
								className='w-[var(--column-width)] font-normal text-foreground first:!sticky first:left-0 first:z-10 first:shadow-[1px_0px_hsl(var(--border))] last:sticky last:right-0 last:z-10'
								{...column.meta}>
								<span>
									{typeof column.cell === 'function'
										? column.cell(data[column.accessorKey])
										: data[column.accessorKey]?.toString?.()}
								</span>
							</TableHead>
						))}
					</TableRow>
					<TableRow className='[&>*]:!bg-table-row-active [&>*]:capitalize'>
						<TableHead
							align='left'
							className='!sticky left-0 z-10'
							style={{ boxShadow: '1px 0px hsl(var(--border))', maxWidth: 200, minWidth: 200 }}>
							<span>{t('ns_erp:fields.inbound_date')}</span>
						</TableHead>
						<TableHead colSpan={7} align='left' className='p-0'>
							<span className='sticky left-[var(--column-width)] block w-[calc(100cqw-10px-2*var(--column-width))] px-4 py-2 text-center'>
								{t('ns_erp:fields.daily_inbound_qty')}
							</span>
						</TableHead>
						<TableHead align='left' className='!sticky right-0 z-10'>
							<span>{t('ns_common:common_fields.total')}</span>
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{Array.isArray(data.daily_inbound_history) && data.daily_inbound_history.length > 0 ? (
						sortBy(data.daily_inbound_history, (history) => history.date).map((history) => {
							return <InboundHistoryRow key={history.date} data={history} />
						})
					) : (
						<TableRow>
							<TableCell colSpan={9} className='!border-b-0 p-0'>
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
							className='!border-b-0 bg-table-row-active p-0 text-table-head-foreground'>
							<Div className='sticky left-0 max-w-[calc(100cqw-10px)] px-4 py-2 text-center'>
								{t('ns_common:titles.overall')}
							</Div>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell colSpan={9} align='left' className='border-t p-0 font-normal'>
							<NestedTable className='w-full'>
								<NestedColumn className='sticky left-0 z-20 min-w-[var(--column-width)] shadow-[1px_0px_hsl(var(--border))] [&>*]:h-9 [&>*]:capitalize'>
									<NestedCellHead>Size</NestedCellHead>
									<NestedCellHead>
										<span>{t('ns_erp:fields.mo_size_qty')}</span>
									</NestedCellHead>
									<NestedCellHead>
										<span>{t('ns_erp:fields.inbound_qty')}</span>
									</NestedCellHead>
									<NestedCellHead>
										<span>{t('ns_erp:fields.missing_qty')}</span>
									</NestedCellHead>
								</NestedColumn>
								{sortBy(data.order_size_run, 'size_numcode').map((item) => {
									const matchedSizeQty = inboundHistoryBySize.find((s) => s.size_numcode === item.size_numcode)
									if (!matchedSizeQty && coalesce(item?.qty, 0) === 0) return null
									const sizeInboundQty = coalesce(matchedSizeQty?.qty, 0)
									return (
										<NestedColumn key={item.size_numcode} className='w-full [&>*]:h-9'>
											<NestedCellHead>{item.size_numcode}</NestedCellHead>
											<NestedCell>{formatIntlNumber(item?.qty)}</NestedCell>
											<NestedCell>{formatIntlNumber(sizeInboundQty)}</NestedCell>
											<NestedCell>{formatIntlNumber(item?.qty - sizeInboundQty)}</NestedCell>
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

const InboundHistoryRow: React.FC<{
	data: {
		date: string
		size_ledger: Array<{
			size_numcode: string
			qty: number
		}>
		timeline: Array<{
			inbound_time: string
			assembly_line: string
			storage_location: string
			size_ledger: Array<{
				size_numcode: string
				qty: number
			}>
		}>
	}
}> = ({ data }) => {
	const [isExpanded, setIsExpanded] = useState<boolean>(false)

	const totalQuantity = useMemo(
		() =>
			Array.isArray(data.size_ledger) ? data.size_ledger.reduce((acc, curr) => acc + coalesce(curr?.qty, 0), 0) : 0,
		[data.size_ledger]
	)

	return (
		<>
			<TableRow key={data.date}>
				<TableCell
					align='left'
					colSpan={1}
					className='sticky left-0 z-10 hover:cursor-pointer'
					style={{ boxShadow: '1px 0px hsl(var(--border))' }}
					onClick={() => setIsExpanded((prev) => !prev)}>
					<span>{data.date}</span>
				</TableCell>
				<TableCell colSpan={7} className='p-0'>
					<NestedTable>
						{sortBy(data.size_ledger, 'size_numcode').map((item) => (
							<NestedColumn key={item.size_numcode} className='[&>*]:h-9'>
								<NestedCellHead>{item.size_numcode}</NestedCellHead>
								<NestedCell>{formatIntlNumber(item?.qty)}</NestedCell>
							</NestedColumn>
						))}
					</NestedTable>
				</TableCell>
				<TableCell colSpan={1} align='left' className='!sticky right-0 z-10 font-medium'>
					<span>{formatIntlNumber(totalQuantity)}</span>
				</TableCell>
			</TableRow>
			{data.timeline?.length > 0 && (
				<TableRow>
					<TableCell colSpan={9} className='!border-b-0 !p-0 aria-expanded:border-b' aria-expanded={isExpanded}>
						<Collapsible open={isExpanded}>
							<CollapsibleContent className='group/detail sticky left-0 w-[100cqw] overflow-auto bg-secondary/50 [scrollbar-gutter:stable]'>
								<Div className='p-3'>
									{Array.isArray(data.timeline) &&
										sortBy(data.timeline, (item) => item.inbound_time).map((timeline) => {
											const totalQty = Array.isArray(timeline.size_ledger)
												? timeline.size_ledger.reduce((acc, curr) => acc + coalesce(curr?.qty, 0), 0)
												: 0
											return (
												<Div
													key={timeline.inbound_time}
													className='flex items-stretch divide-x border-b bg-background last:border-b-0'>
													<Div
														className='sticky left-0 z-10 flex w-28 items-center px-4 py-2'
														style={{ boxShadow: '1px 0px hsl(var(--border))' }}>
														<span>{timeline.inbound_time}</span>
													</Div>
													<Div align='left' className='flex w-28 items-center px-4 py-2'>
														{timeline.assembly_line}
													</Div>
													<Div align='left' className='flex w-28 items-center px-4 py-2'>
														{timeline.storage_location}
													</Div>
													<NestedTable>
														{sortBy(timeline.size_ledger, 'size_numcode').map((item) => (
															<NestedColumn key={item.size_numcode} className='[&>*]:h-9'>
																<NestedCellHead>{item.size_numcode}</NestedCellHead>
																<NestedCell>{formatIntlNumber(item?.qty)}</NestedCell>
															</NestedColumn>
														))}
													</NestedTable>
													<Div
														align='left'
														className='!sticky right-0 z-10 flex w-28 items-center px-4 py-2 font-medium'>
														<span>{formatIntlNumber(totalQty)}</span>
													</Div>
												</Div>
											)
										})}
								</Div>
							</CollapsibleContent>
						</Collapsible>
					</TableCell>
				</TableRow>
			)}
		</>
	)
}

export default InboundHistoryTable
