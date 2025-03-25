import { Div, Icon, Input, Table, TableBody, TableHead, TableHeader, TableRow, Typography } from '@/components/ui'
import { useResetState } from 'ahooks'
import { useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { usePageContext } from '../../_contexts/-page-context'
import { OrderItem } from '../../_types'
import TableDataRow from './-order-size-row'

const OrderSizeDetailTable: React.FC = () => {
	const { t } = useTranslation()
	const { scanningState, scannedOrders } = usePageContext('scanningState', 'scannedOrders')
	const tableWrapperRef = useRef<HTMLDivElement>(null)
	const [columnFilters, setColumnFilters] = useResetState<Omit<OrderItem, 'sizes' | 'factory_code_produce'>>({
		mo_no: '',
		mat_ecolor: '',
		shoes_style_code_factory: ''
	})

	const filteredScannedOrders = useMemo(() => {
		const { mo_no, mat_ecolor, shoes_style_code_factory } = columnFilters
		return Array.isArray(scannedOrders)
			? scannedOrders.filter((item) => {
					if (item)
						return (
							item.mo_no.toLowerCase().includes(mo_no?.toLowerCase()) &&
							item.mat_ecolor.toLowerCase().includes(mat_ecolor.toLowerCase()) &&
							item.shoes_style_code_factory.toLowerCase().includes(shoes_style_code_factory.toLowerCase())
						)
				})
			: []
	}, [scannedOrders, columnFilters])

	return (
		<Div
			className='relative flex h-full max-h-full max-w-full flex-col justify-between divide-y overflow-hidden rounded-lg border'
			ref={tableWrapperRef}>
			<Div className='flow-root max-h-[calc(80vh-1.125rem)] w-full max-w-full overflow-scroll rounded-lg'>
				<Table
					className='w-full border-separate border-spacing-0 rounded-lg'
					style={
						{
							'--sticky-left-col-width': '10rem',
							'--row-action-col-width': '4rem'
						} as React.CSSProperties
					}>
					<TableHeader className='sticky top-0 z-20'>
						<TableRow className='sticky *:bg-table-head'>
							<TableHead className='left-0 z-20 w-[var(--sticky-left-col-width)] min-w-[var(--sticky-left-col-width)] whitespace-nowrap xl:sticky'>
								{t('ns_erp:fields.mo_no')}
							</TableHead>
							<TableHead className='left-[var(--sticky-left-col-width)] z-20 w-[var(--sticky-left-col-width)] min-w-[var(--sticky-left-col-width)] whitespace-nowrap xl:sticky'>
								{t('ns_erp:fields.shoestyle_codefactory')}
							</TableHead>
							<TableHead className='left-[calc(2*var(--sticky-left-col-width))] z-20 w-[var(--sticky-left-col-width)] min-w-[var(--sticky-left-col-width)] whitespace-nowrap border-r-0 drop-shadow-[1px_0px_hsl(var(--border))] xl:sticky'>
								{t('ns_erp:fields.mat_ecolor')}
							</TableHead>
							<TableHead>Size</TableHead>
							<TableHead
								align='right'
								className='right-[var(--row-action-col-width)] z-20 w-28 min-w-28 bg-background xl:sticky'>
								{t('ns_common:common_fields.total')}
							</TableHead>
							<TableHead
								align='right'
								className='right-0 z-20 w-[var(--row-action-col-width)] min-w-[var(--row-action-col-width)] bg-background xl:sticky'>
								<span className='sr-only'>Action</span>
							</TableHead>
						</TableRow>
						{/* Column Filters */}
						<TableRow className='sticky'>
							<TableHead
								align='center'
								className='sticky left-0 z-20 w-[var(--sticky-left-col-width)] min-w-[var(--sticky-left-col-width)] p-0'>
								<Input
									placeholder='Search ...'
									className='w-full border-none font-normal shadow-none'
									onChange={(e) => setColumnFilters((prev) => ({ ...prev, mo_no: e.target.value }))}
								/>
							</TableHead>
							<TableHead
								align='center'
								className='sticky left-[var(--sticky-left-col-width)] z-20 w-[var(--sticky-left-col-width)] min-w-[var(--sticky-left-col-width)] p-0'>
								<Input
									placeholder='Search ...'
									className='w-full border-none font-normal shadow-none'
									onChange={(e) =>
										setColumnFilters((prev) => ({ ...prev, shoes_style_code_factory: e.target.value }))
									}
								/>
							</TableHead>
							<TableHead
								align='center'
								className='sticky left-[calc(2*var(--sticky-left-col-width))] z-20 w-[var(--sticky-left-col-width)] min-w-[var(--sticky-left-col-width)] p-0 drop-shadow-[1px_0px_hsl(var(--border))]'>
								<Input
									placeholder='Search ...'
									className='w-full border-none font-normal shadow-none'
									onChange={(e) =>
										setColumnFilters((prev) => ({
											...prev,
											mat_ecolor: e.target.value
										}))
									}
								/>
							</TableHead>
							<TableHead className='p-0'>
								<span className='sr-only'></span>
							</TableHead>
							<TableHead
								align='center'
								className='sticky right-[var(--row-action-col-width)] z-20 w-28 min-w-28 border-r-0 p-0 drop-shadow-[1px_0px_hsl(var(--border))]'>
								<span className='sr-only'></span>
							</TableHead>
							<TableHead
								align='center'
								className='right-0 z-20 w-[var(--row-action-col-width)] min-w-[var(--row-action-col-width)] bg-background xl:sticky'>
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
				{scanningState !== 'pending' &&
					(!Array.isArray(filteredScannedOrders) || filteredScannedOrders.length === 0) && (
						<Div className='absolute inset-0 grid place-content-center text-center text-sm text-muted-foreground'>
							<Typography className='inline-flex items-center gap-x-2'>
								<Icon name='Inbox' size={32} strokeWidth={1} />
								{t('ns_common:table.no_data')}
							</Typography>
						</Div>
					)}
				{scanningState === 'pending' && (
					<Div className='absolute inset-0 grid place-content-center text-center text-sm text-muted-foreground'>
						<Typography className='inline-flex items-center gap-x-2'>
							<Icon name='LoaderCircle' size={24} className='animate-spin' />
							Loading ...
						</Typography>
					</Div>
				)}
			</Div>
			<Div className='flex basis-[2rem] items-center justify-center gap-x-2 p-3 text-center text-sm text-muted-foreground'>
				<Icon name='Table2' size={20} strokeWidth={1.5} />
				{t('ns_inoutbound:description.outbound_table_caption')}
			</Div>
		</Div>
	)
}

export default OrderSizeDetailTable
