import { IInboundHistory } from '@/common/types/entities'
import formatIntlNumber from '@/common/utils/format-intl-number'
import {
	Div,
	Icon,
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
	Typography
} from '@/components/ui'
import { groupBy, orderBy, sortBy } from 'lodash-es'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetInboundHistoryQuery } from '../-hooks/use-inoutbound-history-asm'
import { NestedCell, NestedCellHead, NestedRow, NestedTable } from '../../-components/shared/horizontal-nested-table'
import PlaceHolderItems from '../../-components/shared/placeholder-items'

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
			{ header: t('ns_erp:fields.factory_shoes_style'), accessorKey: 'shoe_style', meta: { align: 'left' } },
			{ header: t('ns_erp:fields.color_sn'), accessorKey: 'color', meta: { align: 'left' } },
			{
				header: t('ns_erp:fields.mo_qty'),
				accessorKey: 'mo_qty',
				meta: { align: 'right' },
				cell: (value) => formatIntlNumber(value)
			},
			{
				header: t('ns_erp:fields.accumulated_qty'),
				accessorKey: 'accumulated_inbound_qty',
				meta: { align: 'right' },
				cell: (value) => formatIntlNumber(value)
			},
			{
				header: t('ns_erp:fields.missing_qty'),
				accessorKey: 'missing_qty',
				meta: { align: 'right' },
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

	const inboundHistoryByDate = useMemo(() => {
		if (!data) return []
		return Object.entries(
			groupBy(orderBy(data.daily_inbound_history, 'inbound_date', 'desc'), (item) => item.inbound_date)
		)
	}, [data])

	const inboundHistoryBySize = useMemo(() => {
		if (!data) return []
		return orderBy(data.inbound_history_by_size, 'size_numcode', 'asc')
	}, [data])

	if (isLoading)
		return (
			<Div className='h-20 w-full place-content-center place-items-center text-center text-muted-foreground'>
				<Icon name='LoaderCircle' className='animate-[spin_1s_linear_infinite]' />
			</Div>
		)

	if (!data)
		return (
			<Div className='mx-auto flex h-80 max-w-4xl flex-col items-center justify-center rounded-lg border-2 border-dashed p-6'>
				<PlaceHolderItems />
				<Typography variant='small' color='muted'>
					{t('ns_common:table.no_data')}
				</Typography>
			</Div>
		)

	return (
		<Div className='relative h-[600px] overflow-auto rounded-lg border scrollbar-track-accent/50 @container xxl:h-[65vh]'>
			<Table
				className='w-full table-fixed border-separate border-spacing-0 [&_span]:line-clamp-1'
				style={{ '--column-width': '180px' } as React.CSSProperties}>
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
						<TableHead colSpan={6} align='left' className='p-0'>
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
					{inboundHistoryByDate.map(([date, history]) => {
						const totalQty = history.reduce((acc, curr) => acc + curr.qty, 0)
						return (
							<TableRow key={date}>
								<TableCell
									align='left'
									colSpan={1}
									className='sticky left-0 z-10'
									style={{ boxShadow: '1px 0px hsl(var(--border))' }}>
									<span>{date}</span>
								</TableCell>
								<TableCell colSpan={6} className='p-0'>
									<NestedTable>
										{sortBy(history, 'size_numcode').map((item) => (
											<NestedRow key={item.size_numcode} className='[&>*]:h-9'>
												<NestedCellHead>{item.size_numcode}</NestedCellHead>
												<NestedCell>{formatIntlNumber(item.qty)}</NestedCell>
											</NestedRow>
										))}
									</NestedTable>
								</TableCell>
								<TableCell align='left' className='!sticky right-0 z-10 font-medium'>
									<span>{formatIntlNumber(totalQty)}</span>
								</TableCell>
							</TableRow>
						)
					})}
				</TableBody>
				<TableFooter className='sticky bottom-0 z-20 [&>tr:first-child>td]:border-t'>
					<TableRow>
						<TableCell
							colSpan={8}
							align='left'
							className='!border-b-0 bg-table-row-active p-0 text-table-head-foreground'>
							<Div className='sticky left-0 max-w-[calc(100cqw-10px)] px-4 py-2 text-center'>
								{t('ns_common:titles.overall')}
							</Div>
						</TableCell>
					</TableRow>
					<TableRow>
						<TableCell colSpan={8} align='left' className='border-t p-0 font-normal'>
							<NestedTable className='w-full'>
								<NestedRow className='sticky left-0 z-20 min-w-[var(--column-width)] shadow-[1px_0px_hsl(var(--border))] [&>*]:h-9 [&>*]:capitalize'>
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
								</NestedRow>
								{sortBy(data.order_size_run, 'size_numcode').map((item) => {
									const matchedSizeQty = inboundHistoryBySize.find((s) => s.size_numcode === item.size_numcode)
									if (!matchedSizeQty && item.qty === 0) return null
									const sizeInboundQty = matchedSizeQty.qty
									return (
										<NestedRow key={item.size_numcode} className='w-full [&>*]:h-9'>
											<NestedCellHead>{item.size_numcode}</NestedCellHead>
											<NestedCell>{formatIntlNumber(item.qty)}</NestedCell>
											<NestedCell>{formatIntlNumber(sizeInboundQty)}</NestedCell>
											<NestedCell>{formatIntlNumber(item.qty - sizeInboundQty)}</NestedCell>
										</NestedRow>
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
