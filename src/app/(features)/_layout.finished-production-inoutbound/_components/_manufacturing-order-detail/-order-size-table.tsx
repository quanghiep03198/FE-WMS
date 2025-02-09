import { cn } from '@/common/utils/cn'
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
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetOrderDetail } from '../../_apis/rfid.api'
import { useOrderDetailContext } from '../../_contexts/-order-detail-context'
import { usePageContext } from '../../_contexts/-page-context'
import { OrderItem } from '../../_types'
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

	const [columnFilters, setColumnFilters, resetColumnFilters] = useResetState<Omit<OrderItem, 'sizes'>>({
		mo_no: '',
		mat_code: '',
		shoes_style_code_factory: ''
	})

	const { data: retrievedOrderDetail, refetch: refetchOrderDetail } = useGetOrderDetail()

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
		return scannedOrders.filter((item) => selectedRows[0]?.mat_code === item.mat_code)
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
					mat_code: item.mat_code,
					count: item?.sizes?.reduce((acc, curr) => {
						return acc + curr.count
					}, 0)
				}))
			)
		}
	}

	const filteredScannedOrders = useMemo(() => {
		const { mo_no, mat_code, shoes_style_code_factory } = columnFilters
		return scannedOrders.filter((item) => {
			return (
				item.mo_no.toLowerCase().includes(mo_no.toLowerCase()) &&
				item.mat_code.toLowerCase().includes(mat_code.toLowerCase()) &&
				item.shoes_style_code_factory.toLowerCase().includes(shoes_style_code_factory.toLowerCase())
			)
		})
	}, [scannedOrders, columnFilters, dialogOpen])

	const ref = useRef(null)

	return (
		<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
			<HoverCard openDelay={50} closeDelay={50}>
				<HoverCardTrigger asChild>
					<DialogTrigger
						className={cn(buttonVariants({ variant: 'default', size: 'lg', className: 'items-center' }))}>
						<Icon name='List' role='img' />
						{t('ns_common:actions.detail')}
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
			<DialogContent className='max-w-8xl focus-visible:outline-none focus-visible:ring-0 lg:h-screen lg:rounded-none'>
				<DialogHeader>
					<DialogTitle>{t('ns_inoutbound:titles.order_sizing_list')}</DialogTitle>
					<DialogDescription>{t('ns_inoutbound:description.order_sizing_list')}</DialogDescription>
				</DialogHeader>
				<Div className='relative divide-y overflow-hidden rounded-lg border'>
					<Div ref={ref} className='flow-root h-[65vh] overflow-scroll rounded-lg'>
						<Table
							className='w-full border-separate border-spacing-0 rounded-lg'
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
											checked={
												(isAllMatchingRowsSelected ||
													(isSomeMatchingRowsSelected && 'indeterminate')) as CheckedState
											}
											disabled={!selectedRows || selectedRows?.length === 0}
											onCheckedChange={toggleAllMatchedRowsSelected}
										/>
									</TableHead>
									<TableHead className='left-[var(--row-selection-col-width)] z-20 w-[var(--sticky-left-col-width)] min-w-[var(--sticky-left-col-width)] whitespace-nowrap xl:sticky'>
										{t('ns_erp:fields.mo_no')}
									</TableHead>
									<TableHead className='left-[calc(var(--row-selection-col-width)+var(--sticky-left-col-width))] z-20 w-[var(--sticky-left-col-width)] min-w-[var(--sticky-left-col-width)] whitespace-nowrap xl:sticky'>
										{t('ns_erp:fields.shoestyle_codefactory')}
									</TableHead>
									<TableHead className='left-[calc(var(--row-selection-col-width)+2*var(--sticky-left-col-width))] z-20 w-[var(--sticky-left-col-width)] min-w-[var(--sticky-left-col-width)] whitespace-nowrap border-r-0 drop-shadow-[1px_0px_hsl(var(--border))] xl:sticky'>
										{t('ns_erp:fields.mat_code')}
									</TableHead>
									<TableHead>Size</TableHead>
									<TableHead
										align='right'
										className='right-[var(--row-action-col-width)] z-20 w-32 bg-background xl:sticky'>
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
										className='sticky left-[var(--row-selection-col-width)] z-20 w-[var(--sticky-left-col-width)] min-w-[var(--sticky-left-col-width)] p-0'>
										<Input
											placeholder='Search ...'
											className='w-full border-none font-normal'
											onChange={(e) => setColumnFilters((prev) => ({ ...prev, mo_no: e.target.value }))}
										/>
									</TableHead>
									<TableHead
										align='center'
										className='sticky left-[calc(var(--row-selection-col-width)+var(--sticky-left-col-width))] z-20 w-[var(--sticky-left-col-width)] min-w-[var(--sticky-left-col-width)] p-0'>
										<Input
											placeholder='Search ...'
											className='w-full border-none font-normal'
											onChange={(e) =>
												setColumnFilters((prev) => ({ ...prev, shoes_style_code_factory: e.target.value }))
											}
										/>
									</TableHead>
									<TableHead
										align='center'
										className='sticky left-[calc(var(--row-selection-col-width)+2*var(--sticky-left-col-width))] z-20 w-[var(--sticky-left-col-width)] min-w-[var(--sticky-left-col-width)] border-r-0 p-0 drop-shadow-[1px_0px_hsl(var(--border))]'>
										<Input
											placeholder='Search ...'
											className='w-full border-none font-normal'
											onChange={(e) => setColumnFilters((prev) => ({ ...prev, mat_code: e.target.value }))}
										/>
									</TableHead>
									<TableHead></TableHead>
									<TableHead
										align='center'
										className='sticky right-[var(--row-action-col-width)] z-20 w-24 min-w-24'>
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
					<Div className='sticky bottom-0 left-0 flex h-16 items-center justify-between bg-background p-4'>
						<Typography variant='small' color='muted'>
							{t('ns_inoutbound:mo_no_box.caption')}
						</Typography>
						<ExchangeOrderDialogTrigger />
					</Div>
				</Div>
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

	if (!selectedRows || selectedRows?.length === 0) return null

	const handlePreExchangeSelectedRows = () => {
		setOpen(true)
		setDefaultValues({
			mo_no: selectedRows.map((row) => row.mo_no).join(', '),
			mat_code: selectedRows[0]?.mat_code,
			count: selectedRows.reduce((acc, curr) => acc + curr.count, 0)
		})
	}

	return (
		<Button size='sm' onClick={handlePreExchangeSelectedRows}>
			<Icon name='ArrowLeftRight' role='img' /> Exchange
		</Button>
	)
}

export default OrderSizeDetailTable
