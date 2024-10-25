import { cn } from '@/common/utils/cn'
import {
	Badge,
	Button,
	Checkbox,
	// ContextMenu,
	// ContextMenuContent,
	// ContextMenuItem,
	// ContextMenuSub,
	// ContextMenuSubContent,
	// ContextMenuSubTrigger,
	// ContextMenuTrigger,
	Div,
	Icon,
	TableCell,
	TableRow,
	Tooltip
} from '@/components/ui'
import { CheckedState } from '@radix-ui/react-checkbox'
import { pick, uniqBy } from 'lodash'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FALLBACK_ORDER_VALUE } from '../../_apis/rfid.api'
import { useOrderDetailContext } from '../../_contexts/-order-detail-context'
import { OrderSize, usePageContext } from '../../_contexts/-page-context'

type OrderDetailTableRowProps = {
	orderCode: string
	sizeList: Array<OrderSize>
	selectedProductionCode: string
	onBeforeDelete: (orderCode: string) => void
	onSelectedProductionCodeChange: () => void
}

const OrderDetailTableRow: React.FC<OrderDetailTableRowProps> = ({
	orderCode,
	sizeList,
	// data,
	selectedProductionCode,
	onBeforeDelete,
	onSelectedProductionCodeChange
}) => {
	const { scannedSizes } = usePageContext((state) => pick(state, 'scannedSizes'))
	const { t } = useTranslation()

	const {
		selectedRows,
		pushSelectedRow,
		pullSelectedRow,
		setExchangeOrderDialogOpen,
		setExchangeEpcDialogOpen,
		setDefaultExchangeEpcFormValues,
		setDefaultExchangeOrderFormValues
	} = useOrderDetailContext((state) =>
		pick(state, [
			'selectedRows',
			'pushSelectedRow',
			'pullSelectedRow',
			'setExchangeOrderDialogOpen',
			'setExchangeEpcDialogOpen',
			'setDefaultExchangeEpcFormValues',
			'setDefaultExchangeOrderFormValues'
		])
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
			<TableCell className='sticky left-0 z-10 w-12'>
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
			<TableCell className='group/cell sticky left-12 z-10 space-y-1 text-center font-medium drop-shadow-[1px_0px_hsl(var(--border))]'>
				<Div className='flex items-center gap-x-2'>
					{orderCode ?? FALLBACK_ORDER_VALUE}
					<Badge className='whitespace-nowrap'>{sizeList[0]?.shoes_style_code_factory}</Badge>
					<button
						onClick={() => {
							setExchangeOrderDialogOpen(true)
							setDefaultExchangeOrderFormValues({ mo_no: orderCode, count: aggregateSizeCount })
						}}>
						<Icon
							name='ArrowLeftRight'
							className='stroke-active opacity-0 duration-100 group-hover/cell:opacity-100'
						/>
					</button>
				</Div>
			</TableCell>

			<TableCell className={cn('!p-0')} onContextMenu={(e) => e.preventDefault()}>
				<Div
					className='flex flex-grow border-collapse flex-nowrap divide-x'
					onContextMenu={(e) => e.preventDefault()}>
					{sizeList?.map((size) => (
						<Div
							key={size?.size_numcode}
							className='group/cell inline-grid min-w-48 shrink-0 basis-48 grid-rows-2 divide-y last:flex-1'>
							<TableCell className='bg-accent/20 font-medium'>
								<Div className='flex items-center gap-x-2'>
									{size?.size_numcode}
									<Badge
										className={cn(
											selectedProductionCode?.length > 0 && size?.mat_code?.includes(selectedProductionCode)
												? 'border-active text-active selection:bg-transparent'
												: 'text-inherit'
										)}
										variant='outline'
										onMouseUp={onSelectedProductionCodeChange}
										onBlur={() => onSelectedProductionCodeChange()}>
										{size?.mat_code}
									</Badge>
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
			<TableCell align='right' className='sticky right-20 font-medium'>
				{aggregateSizeCount}
			</TableCell>
			<TableCell align='center' className='sticky right-0 w-20 !opacity-100'>
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
