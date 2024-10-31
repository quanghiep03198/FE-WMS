import { cn } from '@/common/utils/cn'
import { Button, Checkbox, Div, Icon, TableCell, TableRow, Tooltip } from '@/components/ui'
import { CheckedState } from '@radix-ui/react-checkbox'
import { uniqBy } from 'lodash'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FALLBACK_ORDER_VALUE } from '../../_apis/rfid.api'
import { useOrderDetailContext } from '../../_contexts/-order-detail-context'
import { OrderSize } from '../../_contexts/-page-context'

type OrderDetailTableRowProps = {
	orderCode: string
	sizeList: Array<OrderSize>
	onBeforeDelete: (orderCode: string) => void
}

const OrderDetailTableRow: React.FC<OrderDetailTableRowProps> = ({ orderCode, sizeList, onBeforeDelete }) => {
	const { t } = useTranslation()
	const {
		selectedRows,
		pushSelectedRow,
		pullSelectedRow,
		setExchangeOrderDialogOpen,
		setExchangeEpcDialogOpen,
		setDefaultExchangeEpcFormValues,
		setDefaultExchangeOrderFormValues
	} = useOrderDetailContext(
		'selectedRows',
		'pushSelectedRow',
		'pullSelectedRow',
		'setExchangeOrderDialogOpen',
		'setExchangeEpcDialogOpen',
		'setDefaultExchangeEpcFormValues',
		'setDefaultExchangeOrderFormValues'
	)

	const hasSomeRowMatch = useMemo(() => {
		if (!selectedRows || selectedRows.length === 0) return false
		const sizeMatCodesSet = new Set(sizeList.map((size) => size.mat_code))
		return selectedRows[0].mat_code.some((productionCode) => sizeMatCodesSet.has(productionCode))
	}, [selectedRows])

	const handleToggleSelectRow = (checked: CheckedState, data: any) => {
		checked ? pushSelectedRow(data) : pullSelectedRow(data)
	}

	const aggregateSizeCount = useMemo(
		() =>
			Array.isArray(sizeList)
				? sizeList.reduce((acc, curr) => {
						return acc + curr.count
					}, 0)
				: 0,
		[sizeList]
	)

	return (
		<TableRow
			className={cn(
				'transition-all duration-500',
				!hasSomeRowMatch && selectedRows.length > 0 && '*:!text-muted-foreground/50'
			)}>
			<TableCell className='sticky left-0 z-10 min-w-[var(--row-selection-col-width)] py-4'>
				<Checkbox
					disabled={!hasSomeRowMatch && selectedRows.length > 0}
					checked={selectedRows.some((row) => row.mo_no === orderCode)}
					onCheckedChange={(checked) =>
						handleToggleSelectRow(checked, {
							mo_no: orderCode,
							mat_code: uniqBy(
								sizeList.map((item) => item.mat_code),
								'mat_code'
							),
							count: aggregateSizeCount
						})
					}
				/>
			</TableCell>
			<TableCell className='group/cell sticky left-[var(--row-selection-col-width)] z-10 min-w-[var(--sticky-left-col-width)] space-y-1 text-center'>
				<Div className='flex items-center gap-x-2'>
					{orderCode ?? FALLBACK_ORDER_VALUE}
					<button
						className='opacity-0 duration-100 group-hover/cell:opacity-100'
						onClick={() => {
							setExchangeOrderDialogOpen(true)
							setDefaultExchangeOrderFormValues({ mo_no: orderCode, count: aggregateSizeCount })
						}}>
						<Icon name='ArrowLeftRight' className='stroke-active' />
					</button>
				</Div>
			</TableCell>
			<TableCell className='sticky left-[calc(var(--row-selection-col-width)+var(--sticky-left-col-width))] z-10 min-w-[var(--sticky-left-col-width)]'>
				{sizeList[0]?.shoes_style_code_factory}
			</TableCell>
			<TableCell className='sticky left-[calc(var(--row-selection-col-width)+2*var(--sticky-left-col-width))] z-10 min-w-[var(--sticky-left-col-width)] border-r-0 drop-shadow-[1px_0px_hsl(var(--border))]'>
				{sizeList[0]?.mat_code}
			</TableCell>
			<TableCell className={cn('!p-0')}>
				<Div
					className='flex flex-grow border-collapse flex-nowrap divide-x'
					onContextMenu={(e) => e.preventDefault()}>
					{sizeList?.map((size) => (
						<Div
							key={size?.size_numcode}
							className='group/cell inline-grid min-w-32 shrink-0 basis-32 grid-rows-2 divide-y last:flex-1'>
							<TableCell className='bg-table-head font-medium'>
								<Div className='flex items-center gap-x-2'>
									{size?.size_numcode}
									<button
										onClick={() => {
											setExchangeEpcDialogOpen(true)
											setDefaultExchangeEpcFormValues(size)
										}}>
										<Icon
											name='ArrowLeftRight'
											className='stroke-active opacity-0 duration-100 group-hover/cell:opacity-100'
										/>
									</button>
								</Div>
							</TableCell>
							<TableCell>{size?.count ?? 0}</TableCell>
						</Div>
					))}
				</Div>
			</TableCell>
			<TableCell align='right' className='sticky right-[var(--row-action-col-width)] font-medium'>
				{aggregateSizeCount}
			</TableCell>
			<TableCell align='center' className='sticky right-0 w-20 min-w-[var(--sticky-right-col-width)] !opacity-100'>
				<Tooltip
					triggerProps={{ asChild: true }}
					contentProps={{ side: 'left' }}
					message={t('ns_common:actions.delete')}>
					<Button
						disabled={orderCode === FALLBACK_ORDER_VALUE}
						type='button'
						variant='ghost'
						size='icon'
						onClick={() => onBeforeDelete(orderCode)}>
						<Icon name='Trash2' className='stroke-destructive' />
					</Button>
				</Tooltip>
			</TableCell>
		</TableRow>
	)
}

export default OrderDetailTableRow
