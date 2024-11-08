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
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
	Typography,
	buttonVariants
} from '@/components/ui'
import { CheckedState } from '@radix-ui/react-checkbox'
import { useMemoizedFn } from 'ahooks'
import { groupBy } from 'lodash'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useGetOrderDetail } from '../../_apis/rfid.api'
import { useOrderDetailContext } from '../../_contexts/-order-detail-context'
import { usePageContext } from '../../_contexts/-page-context'
import TableDataRow from './-order-size-row'

const OrderSizeDetailTable: React.FC = () => {
	const { t } = useTranslation()
	const [dialogOpen, setDialogOpen] = useState<boolean>(false)
	const { scannedOrders, scannedSizes, scanningStatus, setScannedOrders, setScannedSizes } = usePageContext(
		'scannedOrders',
		'scannedSizes',
		'scanningStatus',
		'setScannedOrders',
		'setScannedSizes'
	)
	const { selectedRows, resetSelectedRows, setSelectedRows } = useOrderDetailContext(
		'selectedRows',
		'pullSelectedRow',
		'resetSelectedRows',
		'setSelectedRows'
	)

	const { data, refetch: refetchOrderDetail } = useGetOrderDetail()

	useEffect(() => {
		if (typeof scanningStatus === 'undefined') resetSelectedRows()
		if (scanningStatus === 'disconnected') refetchOrderDetail()
	}, [scanningStatus])

	useEffect(() => {
		setScannedSizes(data?.sizes)
		setScannedOrders(data?.orders)
	}, [data])

	useEffect(() => {
		if (!dialogOpen) resetSelectedRows()
	}, [dialogOpen])

	const allMatchingRowsSelection = useMemo(() => {
		return Object.entries(groupBy(scannedSizes, 'mo_no')).filter(([_, sizeList]) =>
			sizeList.some((size) => selectedRows[0]?.mat_code.includes(size.mat_code))
		)
	}, [selectedRows])

	const isAllMatchingRowsSelected = useMemo(() => {
		if (!selectedRows || selectedRows.length === 0) return false
		const ordersMatchWithFirstSelection = allMatchingRowsSelection.map((item) => item[0])
		return ordersMatchWithFirstSelection.every((orderCode) => selectedRows.some((row) => row.mo_no === orderCode))
	}, [selectedRows])

	const isSomeMatchingRowsSelected =
		selectedRows && selectedRows.length > 0 && selectedRows.length < allMatchingRowsSelection.length

	const toggleAllMatchedRowsSelected = useMemoizedFn((checked: CheckedState) => {
		if (!checked) {
			resetSelectedRows()
		} else {
			setSelectedRows(
				allMatchingRowsSelection.map((item) => ({
					mo_no: item[0],
					mat_code: item[1]?.[0]?.mat_code,
					count: item[1].reduce((acc, curr) => {
						return acc + curr.count
					}, 0)
				}))
			)
		}
	})

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
					{Array.isArray(scannedOrders) && scannedOrders.length > 0 ? (
						<Div
							ref={ref}
							className='flow-root max-h-[65vh] w-full overflow-scroll rounded-lg'
							id='order-size-container'>
							<Table
								className='border-separate border-spacing-0 rounded-lg'
								style={
									{
										'--row-selection-col-width': '3rem',
										'--sticky-left-col-width': '9rem',
										'--row-action-col-width': '5rem'
									} as React.CSSProperties
								}>
								<TableHeader>
									<TableRow className='sticky top-0 z-20 *:bg-table-head'>
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
										<TableHead className='sticky left-[var(--row-selection-col-width)] z-20 w-[var(--sticky-left-col-width)]'>
											{t('ns_erp:fields.mo_no')}
										</TableHead>
										<TableHead className='sticky left-[calc(var(--row-selection-col-width)+var(--sticky-left-col-width))] z-20 w-[var(--sticky-left-left-col-width)]'>
											{t('ns_erp:fields.shoestyle_codefactory')}
										</TableHead>
										<TableHead className='sticky left-[calc(var(--row-selection-col-width)+2*var(--sticky-left-col-width))] z-20 w-[var(--sticky-left-left-col-width)] border-r-0 drop-shadow-[1px_0px_hsl(var(--border))]'>
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
								</TableHeader>
								<TableBody className='[&_tr]:snap-start'>
									{Object.entries(groupBy(scannedSizes, 'mo_no')).map(([orderCode, sizeList]) => {
										return <TableDataRow key={orderCode} orderCode={orderCode} sizeList={sizeList} />
									})}
								</TableBody>
							</Table>
						</Div>
					) : (
						<Div className='inset-0 flex min-h-64 w-full items-center justify-center gap-x-2'>
							<Icon name='Inbox' size={24} strokeWidth={1} />
							{t('ns_common:table.no_data')}
						</Div>
					)}
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
