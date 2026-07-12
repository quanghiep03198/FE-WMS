import {
	Button,
	Checkbox,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Div,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
	Icon,
	Input,
	Separator,
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
	Typography,
	buttonVariants
} from '@/components/ui'
import { type OrderItem } from '@/features/finished-goods/types'
import { cn } from '@common/utils/cn'
import formatIntlNumber from '@common/utils/format-intl-number'
import type { CheckedState } from '@radix-ui/react-checkbox'
import { useResetState } from 'ahooks'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useOrderDetailContext } from '../../../contexts/finished-goods-inbound/order-detail-context'
import { usePageContext } from '../../../contexts/finished-goods-inbound/page-contenxt'
import { useGetInboundOrderDetail } from '../../../hooks/use-inbound-request'
import TableDataRow from './order-detail-row'

const OrderDetailTable: React.FC = () => {
	const { t } = useTranslation()
	const [dialogOpen, setDialogOpen] = useState<boolean>(false)
	const { scannedOrders, scanningStatus, setScannedOrders } = usePageContext(
		'scannedOrders',
		'scanningStatus',
		'setScannedOrders'
	)

	const { selectedRows, resetSelectedRows, setSelectedRows } = useOrderDetailContext(
		'selectedRows',
		'pullSelectedRow',
		'resetSelectedRows',
		'setSelectedRows'
	)

	const [columnFilters, setColumnFilters, resetColumnFilters] = useResetState<
		Omit<OrderItem, 'sizes' | 'factory_code_produce'>
	>({
		mo_no: '',
		color_sn: '',
		factory_shoes_style: ''
	})

	const { data: retrievedOrderDetail, refetch: refetchOrderDetail } = useGetInboundOrderDetail()

	useEffect(() => {
		if (typeof scanningStatus === 'undefined') resetSelectedRows()
		if (scanningStatus === 'disconnected') refetchOrderDetail()
	}, [scanningStatus])

	useEffect(() => {
		setScannedOrders(retrievedOrderDetail)
	}, [retrievedOrderDetail])

	useEffect(() => {
		if (!dialogOpen) {
			resetSelectedRows()
			resetColumnFilters()
		}
	}, [dialogOpen])

	const allMatchingRowsSelection = useMemo(() => {
		return scannedOrders.filter(
			(item) =>
				selectedRows[0]?.color_sn === item.color_sn &&
				selectedRows[0]?.factory_shoes_style === item.factory_shoes_style
		)
	}, [selectedRows])

	const isAllMatchingRowsSelected = useMemo(() => {
		if (!selectedRows || selectedRows.length === 0) return false
		return allMatchingRowsSelection.length === selectedRows.length
	}, [selectedRows])

	const isSomeMatchingRowsSelected =
		selectedRows && selectedRows.length > 0 && selectedRows.length < allMatchingRowsSelection.length

	const toggleAllMatchedRowsSelected = (checked: CheckedState) => {
		if (!checked) {
			resetSelectedRows()
		} else {
			setSelectedRows(
				allMatchingRowsSelection.map((item) => ({
					mo_no: item.mo_no,
					factory_shoes_style: item.factory_shoes_style,
					color_sn: item.color_sn,
					scanned_size_qty:
						item?.sizes?.reduce((acc, curr) => {
							return acc + curr.count
						}, 0) ?? 0
				}))
			)
		}
	}

	const filteredScannedOrders = useMemo(() => {
		const { mo_no, color_sn, factory_shoes_style } = columnFilters
		return scannedOrders.filter((item) => {
			return (
				item.mo_no?.trim()?.toLowerCase()?.includes(mo_no?.trim()?.toLowerCase()) &&
				item.color_sn?.trim()?.toLowerCase()?.includes(color_sn?.trim()?.toLowerCase()) &&
				item.factory_shoes_style?.trim()?.toLowerCase()?.includes(factory_shoes_style?.trim()?.toLowerCase())
			)
		})
	}, [scannedOrders, columnFilters, dialogOpen])

	const totalFilteredQty = useMemo(
		() =>
			Array.isArray(filteredScannedOrders) && filteredScannedOrders.every((item) => Array.isArray(item.sizes))
				? formatIntlNumber(
						filteredScannedOrders?.reduce(
							(acc, curr) => acc + curr.sizes.reduce((_acc, _curr) => _acc + _curr.count, 0),
							0
						)
					)
				: 0,
		[filteredScannedOrders]
	)

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<HoverCard openDelay={50} closeDelay={50}>
				<HoverCardTrigger asChild>
					<DialogTrigger
						className={cn(buttonVariants({ variant: 'default', size: 'lg', className: 'items-center' }))}>
						{t('ns_common:actions.detail')}
						<Icon name='ArrowUpRight' />
					</DialogTrigger>
				</HoverCardTrigger>
				<HoverCardContent
					side='top'
					align='start'
					sideOffset={8}
					className='w-[var(--radix-hover-card-trigger-width)] text-pretty'>
					<Typography variant='small'>{t('ns_inoutbound:description.order_size_detail')}</Typography>
				</HoverCardContent>
			</HoverCard>
			<DialogContent className='static h-screen max-w-[screen] overflow-hidden rounded-none border-none focus-visible:outline-none focus-visible:ring-0'>
				<DialogHeader>
					<DialogTitle>{t('ns_inoutbound:titles.order_sizing_list')}</DialogTitle>
					<DialogDescription>{t('ns_inoutbound:description.order_sizing_list')}</DialogDescription>
				</DialogHeader>
				<Div className='static flex h-[calc(85vh-2rem)] flex-col items-stretch divide-y overflow-hidden rounded-lg border'>
					<Div
						className='relative h-[85vh] overflow-scroll rounded-lg scrollbar-track-accent/20 @container [scrollbar-gutter:stable]'
						style={
							{
								'--row-selection-col-width': '50px',
								'--sticky-left-col-width': '140px',
								'--sticky-right-col-width': '100px',
								'--row-action-col-width': '60px'
							} as React.CSSProperties
						}>
						<Table
							className={cn(
								'w-full table-auto [&_span]:line-clamp-1',
								'@5xl:[&_tr>:first-child]:sticky @5xl:[&_tr>:first-child]:left-0 @5xl:[&_tr>:first-child]:z-10',
								'@5xl:[&_tr>:nth-child(2)]:sticky @5xl:[&_tr>:nth-child(2)]:left-[var(--row-selection-col-width)] @5xl:[&_tr>:nth-child(2)]:z-10',
								'@5xl:[&_tr>:nth-child(3)]:sticky @5xl:[&_tr>:nth-child(3)]:left-[calc(var(--row-selection-col-width)+var(--sticky-left-col-width))] @5xl:[&_tr>:nth-child(3)]:z-10',
								'[&_tr>:nth-child(4)]:shadow-[1px_0px_hsl(var(--border))] @5xl:[&_tr>:nth-child(4)]:sticky @5xl:[&_tr>:nth-child(4)]:left-[calc(var(--row-selection-col-width)+2*var(--sticky-left-col-width))] @5xl:[&_tr>:nth-child(4)]:z-10',
								'@5xl:[&_tr>:nth-last-child(2)]:sticky @5xl:[&_tr>:nth-last-child(2)]:right-[var(--row-action-col-width)] @5xl:[&_tr>:nth-last-child(2)]:z-10',
								'@5xl:[&_tr>:last-child]:sticky @5xl:[&_tr>:last-child]:right-0 @5xl:[&_tr>:last-child]:z-10'
							)}>
							<colgroup>
								<col
									style={{
										minWidth: 'var(--row-selection-col-width)',
										maxWidth: 'var(--row-selection-col-width)'
									}}
								/>
								<col
									style={{
										width: 'var(--sticky-left-col-width) !important',
										minWidth: 'var(--sticky-left-col-width)',
										maxWidth: 'var(--sticky-left-col-width)'
									}}
								/>
								<col
									style={{
										width: 'var(--sticky-left-col-width)',
										minWidth: 'var(--sticky-left-col-width)',
										maxWidth: 'var(--sticky-left-col-width)'
									}}
								/>
								<col
									style={{
										minWidth: 'var(--sticky-left-col-width)',
										maxWidth: 'var(--sticky-left-col-width)'
									}}
								/>
								<col
									style={{
										minWidth:
											'calc(100cqw - var(--row-selection-col-width) - 3 * var(--sticky-left-col-width) - var(--sticky-right-col-width) - var(--row-action-col-width))'
									}}
								/>
								<col
									style={{
										maxWidth: 'var(--sticky-right-col-width)',
										minWidth: 'var(--sticky-right-col-width)'
									}}
								/>
								<col
									style={{
										minWidth: 'var(--row-action-col-width)',
										maxWidth: 'var(--row-action-col-width)'
									}}
								/>
							</colgroup>
							<TableHeader className={cn('sticky top-0 z-20')}>
								<TableRow className='*:bg-table-head'>
									<TableHead>
										<Checkbox
											role='checkbox'
											checked={
												(isAllMatchingRowsSelected ||
													(isSomeMatchingRowsSelected && 'indeterminate')) as CheckedState
											}
											disabled={!selectedRows || selectedRows?.length === 0}
											onCheckedChange={toggleAllMatchedRowsSelected}
										/>
									</TableHead>
									<TableHead align='left'>{t('ns_erp:fields.mo_no')}</TableHead>
									<TableHead align='left'>
										<span>{t('ns_erp:fields.factory_shoes_style')}</span>
									</TableHead>
									<TableHead align='left'>
										<span>{t('ns_erp:fields.color_sn')}</span>
									</TableHead>
									<TableHead align='left' className='p-0'>
										<span className='block w-full px-4 py-2 text-center @5xl:sticky @5xl:left-[calc(var(--row-selection-col-width)+3*var(--sticky-left-col-width))] @5xl:max-w-[calc(100cqw-var(--row-selection-col-width)-3*var(--sticky-left-col-width)-var(--sticky-right-col-width)-var(--row-action-col-width))]'>
											Size
										</span>
									</TableHead>
									<TableHead
										align='right'
										className='right-[var(--row-action-col-width)] z-20 w-[var(--sticky-right-col-width)] bg-background xl:sticky'>
										<span>{t('ns_common:common_fields.total')}</span>
									</TableHead>
									<TableHead>
										<span className='sr-only'></span>
									</TableHead>
								</TableRow>
								{/* Column Filters */}
								<TableRow>
									<TableHead align='center'></TableHead>
									<TableHead align='center'>
										<Input
											role='textbox'
											placeholder='Search ...'
											className='w-full border-none font-normal shadow-none transition-none'
											onChange={(e) => setColumnFilters((prev) => ({ ...prev, mo_no: e.target.value }))}
										/>
									</TableHead>
									<TableHead align='center'>
										<Input
											role='textbox'
											placeholder='Search ...'
											className='w-full border-none font-normal shadow-none transition-none'
											onChange={(e) =>
												setColumnFilters((prev) => ({
													...prev,
													factory_shoes_style: e.target.value
												}))
											}
										/>
									</TableHead>
									<TableHead align='center'>
										<Input
											role='textbox'
											placeholder='Search ...'
											className='w-full border-none font-normal shadow-none transition-none'
											onChange={(e) => setColumnFilters((prev) => ({ ...prev, color_sn: e.target.value }))}
										/>
									</TableHead>
									<TableHead>
										<span className='sr-only'></span>
									</TableHead>
									<TableHead align='center'>
										<span className='sr-only'></span>
									</TableHead>

									<TableHead align='center'>
										<span className='sr-only'></span>
									</TableHead>
								</TableRow>
							</TableHeader>
							{Array.isArray(filteredScannedOrders) && filteredScannedOrders.length > 0 && (
								<TableBody>
									{filteredScannedOrders.map((order) => {
										return <TableDataRow key={order.mo_no} data={order} />
									})}
								</TableBody>
							)}
						</Table>
						{(!Array.isArray(filteredScannedOrders) || filteredScannedOrders.length === 0) && (
							<Div className='absolute inset-0 grid place-content-center text-center text-sm text-muted-foreground'>
								<Typography className='inline-flex items-center gap-x-2'>
									<Icon name='Inbox' size={20} />
									{t('ns_common:table.no_data')}
								</Typography>
							</Div>
						)}
					</Div>
					<Div className='flex basis-16 items-center justify-between bg-background px-2 pr-4'>
						<ExchangeOrderDialogTrigger />
						<Div className='mr-2 flex flex-1 items-center justify-end gap-x-2 bg-background'>
							<Typography color='muted' className='font-medium'>
								{t('ns_common:common_fields.total')}
							</Typography>
							<Separator orientation='horizontal' className='h-0.5 basis-4' />
							<Typography className='inline-flex items-baseline gap-x-1 font-medium'>
								{totalFilteredQty}
								<Typography variant='small'>pcs</Typography>
							</Typography>
						</Div>
					</Div>
				</Div>
				<Typography
					variant='small'
					color='muted'
					className='flex h-fit items-center justify-center gap-x-2 text-center'>
					<Icon name='Info' size={18} />
					{t('ns_inoutbound:mo_no_box.caption')}
				</Typography>
			</DialogContent>
		</Dialog>
	)
}

const ExchangeOrderDialogTrigger: React.FC = () => {
	const {
		selectedRows,
		setDefaultExchangeOrderFormValues: setDefaultValues,
		setExchangeOrderDialogOpen: setOpen
	} = useOrderDetailContext('selectedRows', 'setExchangeOrderDialogOpen', 'setDefaultExchangeOrderFormValues')

	const handlePreExchangeSelectedRows = () => {
		setOpen(true)
		setDefaultValues({
			mo_no: selectedRows.map((row) => row.mo_no).join(', '),
			color_sn: selectedRows[0]?.color_sn,
			factory_shoes_style: selectedRows[0]?.factory_shoes_style,
			scanned_size_qty: selectedRows.reduce((acc, curr) => acc + curr.scanned_size_qty, 0)
		})
	}

	return (
		<Button onClick={handlePreExchangeSelectedRows} disabled={!selectedRows || selectedRows?.length === 0}>
			<Icon name='ArrowLeftRight' /> Exchange
		</Button>
	)
}

export default OrderDetailTable
