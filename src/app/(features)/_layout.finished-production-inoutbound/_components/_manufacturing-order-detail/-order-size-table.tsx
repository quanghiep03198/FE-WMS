import { OrderItem } from '@/app/_shared/_types/rfid'
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
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	Typography,
	buttonVariants
} from '@/components/ui'
import { ESTIMATE_SIZE } from '@/components/ui/@react-table/components/table'
import { CheckedState } from '@radix-ui/react-checkbox'
import { useMemoizedFn, useReactive } from 'ahooks'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetOrderDetail } from '../../_apis/rfid.api'
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

	const columnFilters = useReactive<Omit<OrderItem, 'sizes'>>({
		mo_no: '',
		mat_code: '',
		shoes_style_code_factory: ''
	})

	const { data, refetch: refetchOrderDetail } = useGetOrderDetail()

	useEffect(() => {
		if (typeof scanningStatus === 'undefined') resetSelectedRows()
		if (scanningStatus === 'disconnected') refetchOrderDetail()
	}, [scanningStatus])

	useEffect(() => {
		setScannedOrders(data)
	}, [data])

	useEffect(() => {
		if (!dialogOpen) resetSelectedRows()
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

	const toggleAllMatchedRowsSelected = useMemoizedFn((checked: CheckedState) => {
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
	})

	const filteredScannedOrders = useMemo(() => {
		const { mo_no, mat_code, shoes_style_code_factory } = columnFilters
		return scannedOrders.filter((item) => {
			return (
				item.mo_no.toLowerCase().includes(mo_no.toLowerCase()) &&
				item.mat_code.toLowerCase().includes(mat_code.toLowerCase()) &&
				item.shoes_style_code_factory.toLowerCase().includes(shoes_style_code_factory.toLowerCase())
			)
		})
	}, [scannedOrders, columnFilters])

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
				<HoverCardContent side='top' align='start' sideOffset={8}>
					<Typography variant='small'>{t('ns_inoutbound:description.order_size_detail')}</Typography>
				</HoverCardContent>
			</HoverCard>
			<DialogContent className='max-w-8xl focus-visible:outline-none focus-visible:ring-0'>
				<DialogHeader>
					<DialogTitle>{t('ns_inoutbound:titles.order_sizing_list')}</DialogTitle>
					<DialogDescription>{t('ns_inoutbound:description.order_sizing_list')}</DialogDescription>
				</DialogHeader>
				<Div className='divide-y overflow-hidden rounded-lg border'>
					<Div ref={ref} className='flow-root h-[65vh] w-full overflow-scroll rounded-lg'>
						<Table
							className='border-separate border-spacing-0 rounded-lg'
							style={
								{
									'--row-selection-col-width': '3rem',
									'--sticky-left-col-width': '9rem',
									'--row-action-col-width': '5rem',
									'--header-cell-height': `${ESTIMATE_SIZE}px`
								} as React.CSSProperties
							}>
							<TableHeader className='sticky top-0 z-20'>
								<TableRow className='*:bg-table-head'>
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
									<TableHead className='sticky left-[var(--row-selection-col-width)] z-20 w-[var(--sticky-left-col-width)] min-w-full'>
										{t('ns_erp:fields.mo_no')}
									</TableHead>
									<TableHead className='sticky left-[calc(var(--row-selection-col-width)+var(--sticky-left-col-width))] z-20 w-[var(--sticky-left-left-col-width)] min-w-full'>
										{t('ns_erp:fields.shoestyle_codefactory')}
									</TableHead>
									<TableHead className='sticky left-[calc(var(--row-selection-col-width)+2*var(--sticky-left-col-width))] z-20 w-[var(--sticky-left-left-col-width)] min-w-full border-r-0 drop-shadow-[1px_0px_hsl(var(--border))]'>
										{t('ns_erp:fields.mat_code')}
									</TableHead>
									<TableHead>Size</TableHead>
									<TableHead
										align='right'
										className='sticky left-auto right-[var(--row-action-col-width)] z-20 min-w-32'>
										{t('ns_common:common_fields.total')}
									</TableHead>
									<TableHead className='sticky left-auto right-0 z-20 min-w-[var(--row-action-col-width)]'>
										-
									</TableHead>
								</TableRow>
								{/* Column Filters */}
								<TableRow className='sticky top-[37px] z-20'>
									<TableHead
										align='center'
										className='sticky left-0 z-20 w-[var(--row-selection-col-width)]'></TableHead>
									<TableHead
										align='center'
										className='sticky left-[var(--row-selection-col-width)] z-20 w-[var(--sticky-left-col-width)] p-0'>
										<Input
											placeholder='Search ...'
											className='min-w-full border-none'
											onChange={(e) => {
												columnFilters.mo_no = e.target.value
											}}
										/>
									</TableHead>
									<TableHead
										align='center'
										className='sticky left-[calc(var(--row-selection-col-width)+var(--sticky-left-col-width))] z-20 w-[var(--sticky-left-left-col-width)] p-0'>
										<Input
											placeholder='Search ...'
											className='min-w-full border-none'
											onChange={(e) => {
												columnFilters.shoes_style_code_factory = e.target.value
											}}
										/>
									</TableHead>
									<TableHead
										align='center'
										className='sticky left-[calc(var(--row-selection-col-width)+2*var(--sticky-left-col-width))] z-20 w-[var(--sticky-left-left-col-width)] border-r-0 p-0 drop-shadow-[1px_0px_hsl(var(--border))]'>
										<Input
											placeholder='Search ...'
											className='min-w-full border-none'
											onChange={(e) => {
												columnFilters.mat_code = e.target.value
											}}
										/>
									</TableHead>
									<TableHead
										align='center'
										className='sticky left-0 z-20 w-[var(--row-selection-col-width)]'></TableHead>
									<TableHead
										align='center'
										className='sticky left-auto right-[var(--row-action-col-width)] z-20 min-w-32'></TableHead>
									<TableHead
										align='center'
										className='sticky left-auto right-0 z-20 min-w-[var(--row-action-col-width)]'></TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{filteredScannedOrders.length > 0 ? (
									filteredScannedOrders.map((order) => {
										return <TableDataRow key={order.mo_no} data={order} />
									})
								) : (
									<TableRow>
										<TableCell colSpan={6}>
											<Div className='grid h-[calc(65vh-74px)] place-content-center text-center text-sm text-muted-foreground'>
												<Typography className='inline-flex items-center gap-x-2'>
													<Icon name='Inbox' size={20} />
													{t('ns_common:table.no_data')}
												</Typography>
											</Div>
										</TableCell>
									</TableRow>
								)}
							</TableBody>
						</Table>
					</Div>

					<Div className='sticky bottom-0 left-0 flex h-16 items-center justify-between bg-background p-4'>
						<Typography variant='small' color='muted'>
							{t('ns_inoutbound:mo_no_box.caption')}
						</Typography>
						<ExchangeSelectedOrderTrigger />
					</Div>
				</Div>
			</DialogContent>
		</Dialog>
	)
}

const ExchangeSelectedOrderTrigger: React.FC = () => {
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
