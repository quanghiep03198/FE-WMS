import { type OrderItem } from '@/app/(features)/_types/rfid'
import { cn } from '@/common/utils/cn'
import formatIntlNumber from '@/common/utils/format-intl-number'
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
import { CheckedState } from '@radix-ui/react-checkbox'
import { useResetState } from 'ahooks'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetInboundOrderDetail } from '../../_apis/inbound-rfid.api'
import { useOrderDetailContext } from '../../_contexts/-order-detail-context'
import { usePageContext } from '../../_contexts/-page-context'
import TableDataRow from './-order-size-row'

const OrderSizeDetailTable: React.FC = () => {
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
		shoes_style_code_factory: ''
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
				selectedRows[0]?.shoes_style_code_factory === item.shoes_style_code_factory
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
					shoes_style_code_factory: item.shoes_style_code_factory,
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
		const { mo_no, color_sn, shoes_style_code_factory } = columnFilters
		return scannedOrders.filter((item) => {
			return (
				item.mo_no?.toLowerCase()?.includes(mo_no?.toLowerCase()) &&
				item.color_sn?.toLowerCase()?.includes(color_sn?.toLowerCase()) &&
				item.shoes_style_code_factory?.toLowerCase()?.includes(shoes_style_code_factory?.toLowerCase())
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
						className={cn(buttonVariants({ variant: 'secondary', size: 'lg', className: 'items-center' }))}>
						{t('ns_common:actions.detail')}
						<Icon name='ArrowUpRight' role='presentation' />
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
			<DialogContent className='h-screen max-w-[screen] overflow-hidden rounded-none border-none focus-visible:outline-none focus-visible:ring-0'>
				<DialogHeader>
					<DialogTitle>{t('ns_inoutbound:titles.order_sizing_list')}</DialogTitle>
					<DialogDescription>{t('ns_inoutbound:description.order_sizing_list')}</DialogDescription>
				</DialogHeader>
				<Div className='relative flex h-[calc(85vh-4rem)] flex-col divide-y overflow-hidden rounded-lg border'>
					<Div className='flow-root h-[85vh] overflow-scroll rounded-lg scrollbar-track-accent/20'>
						<Table
							className='border-separate border-spacing-0 rounded-lg'
							style={
								{
									'--row-selection-col-width': '3rem',
									'--sticky-left-col-width': '10rem',
									'--row-action-col-width': '5rem'
								} as React.CSSProperties
							}>
							<TableHeader className='sticky top-0 z-20'>
								<TableRow className='sticky *:bg-table-head'>
									<TableHead className='sticky left-0 z-20 w-[var(--row-selection-col-width)]'>
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
									<TableHead
										align='left'
										className='left-[var(--row-selection-col-width)] z-20 w-[var(--sticky-left-col-width)] min-w-[var(--sticky-left-col-width)] whitespace-nowrap xl:sticky'>
										{t('ns_erp:fields.mo_no')}
									</TableHead>
									<TableHead
										align='left'
										className='left-[calc(var(--row-selection-col-width)+var(--sticky-left-col-width))] z-20 w-[var(--sticky-left-col-width)] min-w-[var(--sticky-left-col-width)] whitespace-nowrap xl:sticky'>
										{t('ns_erp:fields.shoestyle_codefactory')}
									</TableHead>
									<TableHead
										align='left'
										className='left-[calc(var(--row-selection-col-width)+2*var(--sticky-left-col-width))] z-20 w-[var(--sticky-left-col-width)] min-w-[var(--sticky-left-col-width)] whitespace-nowrap border-r-0 drop-shadow-[1px_0px_hsl(var(--border))] xl:sticky'>
										{t('ns_erp:fields.color_sn')}
									</TableHead>
									<TableHead>Size</TableHead>
									<TableHead
										align='right'
										className='right-[var(--row-action-col-width)] z-20 w-28 min-w-28 bg-background xl:sticky'>
										{t('ns_common:common_fields.total')}
									</TableHead>
									<TableHead className='right-0 z-20 w-[var(--row-action-col-width)] min-w-[var(--row-action-col-width)] bg-background xl:sticky'>
										<span className='sr-only'></span>
									</TableHead>
								</TableRow>
								{/* Column Filters */}
								<TableRow className='sticky'>
									<TableHead
										align='center'
										className='sticky left-0 z-20 w-[var(--row-selection-col-width)] min-w-[var(--row-selection-col-width)]'></TableHead>
									<TableHead
										align='center'
										className='sticky left-[var(--row-selection-col-width)] z-20 w-[var(--sticky-left-col-width)] min-w-[var(--sticky-left-col-width)]'>
										<Input
											role='textbox'
											placeholder='Search ...'
											className='w-full border-none font-normal shadow-none transition-none'
											onChange={(e) => setColumnFilters((prev) => ({ ...prev, mo_no: e.target.value }))}
										/>
									</TableHead>
									<TableHead
										align='center'
										className='sticky left-[calc(var(--row-selection-col-width)+var(--sticky-left-col-width))] z-20 w-[var(--sticky-left-col-width)] min-w-[var(--sticky-left-col-width)]'>
										<Input
											role='textbox'
											placeholder='Search ...'
											className='w-full border-none font-normal shadow-none transition-none'
											onChange={(e) =>
												setColumnFilters((prev) => ({
													...prev,
													shoes_style_code_factory: e.target.value
												}))
											}
										/>
									</TableHead>
									<TableHead
										align='center'
										className='sticky left-[calc(var(--row-selection-col-width)+2*var(--sticky-left-col-width))] z-20 w-[var(--sticky-left-col-width)] min-w-[var(--sticky-left-col-width)] border-r-0 drop-shadow-[1px_0px_hsl(var(--border))]'>
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
									<TableHead
										align='center'
										className='sticky right-[var(--row-action-col-width)] z-20 w-28 min-w-28'>
										<span className='sr-only'></span>
									</TableHead>
									<TableHead align='center' className='sticky right-0 z-20 w-[var(--row-action-col-width)]'>
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
					<Div className='flex basis-16 items-center justify-between bg-background p-4'>
						<ExchangeOrderDialogTrigger />
						<Div className='flex flex-1 items-center justify-end gap-x-2 bg-background'>
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
			shoes_style_code_factory: selectedRows[0]?.shoes_style_code_factory,
			scanned_size_qty: selectedRows.reduce((acc, curr) => acc + curr.scanned_size_qty, 0)
		})
	}

	return (
		<Button onClick={handlePreExchangeSelectedRows} disabled={!selectedRows || selectedRows?.length === 0}>
			<Icon name='ArrowLeftRight' role='presentation' /> Exchange
		</Button>
	)
}

export default OrderSizeDetailTable
