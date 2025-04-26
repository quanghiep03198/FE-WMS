import formatIntlNumber from '@/common/utils/format-intl-number'
import {
	Div,
	Icon,
	Input,
	Separator,
	Table,
	TableBody,
	TableHead,
	TableHeader,
	TableRow,
	Typography
} from '@/components/ui'
import { useResetState } from 'ahooks'
import { sortBy } from 'lodash'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { usePageContext } from '../../_contexts/-page-context'
import { OrderItem } from '../../_types'
import TableDataRow from './-order-size-row'

const OrderSizeDetailTable: React.FC = () => {
	const { t } = useTranslation()
	const { scanningState, scannedOrders } = usePageContext('scanningState', 'scannedOrders')
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
		<Div
			className='z-20 flex h-[var(--outlet-wrapper-height)] max-w-full flex-1 flex-col justify-between gap-0 divide-y overflow-hidden rounded-lg border xxl:sticky xxl:top-[var(--header-height)]'
			style={
				{
					'--table-footer-height': '2rem'
				} as React.CSSProperties
			}>
			<Div className='h-[calc(var(--outlet-wrapper-height)-1.25*var(--table-footer-height))] w-full max-w-full overflow-scroll rounded-lg'>
				<Table
					className='w-full border-separate border-spacing-0 rounded-lg'
					style={
						{
							'--sticky-left-col-width': '9rem',
							'--row-action-col-width': '4rem'
						} as React.CSSProperties
					}>
					<TableHeader className='sticky top-0 z-20'>
						<TableRow className='sticky top-0 *:bg-table-head'>
							<TableHead
								align='left'
								className='z-20 w-[var(--sticky-left-col-width)] min-w-[var(--sticky-left-col-width)] whitespace-normal xl:sticky xl:left-0'>
								<span className='line-clamp-1' title={t('ns_erp:fields.mo_no')}>
									{t('ns_erp:fields.mo_no')}
								</span>
							</TableHead>
							<TableHead
								align='left'
								className='z-20 w-[var(--sticky-left-col-width)] min-w-[var(--sticky-left-col-width)] whitespace-normal xl:sticky xl:left-[var(--sticky-left-col-width)]'>
								<span className='line-clamp-1' title={t('ns_erp:fields.shoestyle_codefactory')}>
									{t('ns_erp:fields.shoestyle_codefactory')}
								</span>
							</TableHead>
							<TableHead
								align='left'
								className='z-20 w-[var(--sticky-left-col-width)] min-w-[var(--sticky-left-col-width)] whitespace-normal border-r-0 !drop-shadow-[1px_0px_hsl(var(--border))] xl:sticky xl:left-[calc(2*var(--sticky-left-col-width))]'>
								<span className='line-clamp-1' title={t('ns_erp:fields.mat_ecolor')}>
									{t('ns_erp:fields.mat_ecolor')}
								</span>
							</TableHead>
							<TableHead className='border-x-0' title='Size'>
								Size
							</TableHead>
							<TableHead
								align='right'
								className='z-20 w-28 min-w-28 bg-background xl:sticky xl:right-[var(--row-action-col-width)]'
								title={t('ns_common:common_fields.total')}>
								{t('ns_common:common_fields.total')}
							</TableHead>
							<TableHead
								align='center'
								className='z-20 w-[var(--row-action-col-width)] min-w-[var(--row-action-col-width)] bg-background xl:sticky xl:right-0'
								title={t('ns_common:common_fields.actions')}>
								<span className='line-clamp-1'>-</span>
							</TableHead>
						</TableRow>
						{/* Column Filters */}
						<TableRow className='sticky'>
							<TableHead
								align='center'
								className='z-20 w-[var(--sticky-left-col-width)] min-w-[var(--sticky-left-col-width)] xl:sticky xl:left-0'>
								<Input
									role='textbox'
									placeholder='Search ...'
									className='w-full border-none font-normal shadow-none'
									onChange={(e) => setColumnFilters((prev) => ({ ...prev, mo_no: e.target.value }))}
								/>
							</TableHead>
							<TableHead
								align='center'
								className='z-20 w-[var(--sticky-left-col-width)] min-w-[var(--sticky-left-col-width)] xl:sticky xl:left-[var(--sticky-left-col-width)]'>
								<Input
									role='textbox'
									placeholder='Search ...'
									className='w-full border-none font-normal shadow-none'
									onChange={(e) =>
										setColumnFilters((prev) => ({ ...prev, shoes_style_code_factory: e.target.value }))
									}
								/>
							</TableHead>
							<TableHead
								align='center'
								className='z-20 w-[var(--sticky-left-col-width)] min-w-[var(--sticky-left-col-width)] drop-shadow-[1px_0px_hsl(var(--border))] xl:sticky xl:left-[calc(2*var(--sticky-left-col-width))]'>
								<Input
									role='textbox'
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
								className='z-20 w-28 min-w-28 border-r-0 drop-shadow-[1px_0px_hsl(var(--border))] xl:sticky xl:right-[var(--row-action-col-width)]'>
								<span className='sr-only'></span>
							</TableHead>
							<TableHead
								align='center'
								className='z-20 w-[var(--row-action-col-width)] min-w-[var(--row-action-col-width)] bg-background xl:sticky xl:right-0'>
								<span className='sr-only'></span>
							</TableHead>
						</TableRow>
					</TableHeader>
					{Array.isArray(filteredScannedOrders) && filteredScannedOrders.length > 0 && (
						<TableBody>
							{sortBy(filteredScannedOrders, 'mo_no').map((order) => {
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
					<Div className='absolute inset-0 z-10 grid flex-1 place-content-center text-center text-sm text-muted-foreground'>
						<Typography className='inline-flex items-center gap-x-2'>
							<Icon name='LoaderCircle' size={24} className='animate-spin' />
							Loading ...
						</Typography>
					</Div>
				)}
			</Div>
			<Div className='flex basis-[var(--table-footer-height)] items-center justify-center gap-x-2 p-3 px-4 text-center text-sm text-muted-foreground'>
				<Typography variant='small'>{t('ns_inoutbound:description.outbound_table_caption')}</Typography>
				<Div className='inline-flex flex-1 items-center justify-end gap-x-2 bg-background'>
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
	)
}

export default OrderSizeDetailTable
