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
import { pick } from 'lodash'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { FALLBACK_ORDER_VALUE } from '../../_apis/rfid.api'
import { useOrderDetailContext } from '../../_contexts/-order-detail-context'
import { OrderItem, usePageContext } from '../../_contexts/-page-context'

type OrderDetailTableRowProps = {
	data: OrderItem
	onBeforeDelete?: (orderCode: string) => void
}

const OrderDetailTableRow: React.FC<OrderDetailTableRowProps> = ({ data, onBeforeDelete }) => {
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

	const filteredSizeByOrder = useMemo(
		() => scannedSizes?.filter((size) => size?.mo_no === data?.mo_no),
		[scannedSizes, data]
	)

	const sizeOfFirstSelectedRow = useMemo(
		() => (selectedRows[0] ? scannedSizes?.filter((item) => item.mo_no === selectedRows[0].mo_no) : []),
		[selectedRows, data]
	)

	const hasSomeRowMatch = useMemo(() => {
		return filteredSizeByOrder?.some((filteredSize) =>
			sizeOfFirstSelectedRow?.some((selectedSize) => selectedSize.mat_code === filteredSize.mat_code)
		)
	}, [filteredSizeByOrder, sizeOfFirstSelectedRow])

	const handleToggleSelectRow = (checked: CheckedState, data: any) => {
		checked ? pushSelectedRow(data) : pullSelectedRow(data)
	}

	return (
		<TableRow
			className={cn(
				'transition-all duration-500',
				!hasSomeRowMatch && selectedRows.length > 0 && '*:!text-muted-foreground'
			)}>
			<TableCell className='sticky left-0 z-10 w-12'>
				<Checkbox
					disabled={!hasSomeRowMatch && selectedRows.length > 0}
					checked={selectedRows.some((row) => row.mo_no === data?.mo_no)}
					onCheckedChange={(checked) => handleToggleSelectRow(checked, data)}
				/>
			</TableCell>
			<TableCell className='group/cell sticky left-12 z-10 font-medium drop-shadow-[1px_0px_hsl(var(--border))]'>
				<Div className='inline-flex items-center gap-x-4'>
					{data?.mo_no ?? FALLBACK_ORDER_VALUE}
					<button
						onClick={() => {
							setExchangeOrderDialogOpen(true)
							setDefaultExchangeOrderFormValues({ ...data })
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
					{filteredSizeByOrder?.map((size) => (
						<Div
							key={size?.size_numcode}
							className='group/cell inline-grid min-w-48 shrink-0 basis-48 grid-rows-2 divide-y last:flex-1'>
							<TableCell className='bg-accent/20 font-medium'>
								<Div className='flex items-center gap-x-2'>
									{size?.size_numcode}
									<Badge className='text-inherit' variant='outline'>
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
				{data?.count}
			</TableCell>
			<TableCell align='center' className='sticky right-0 w-20 !opacity-100'>
				<Tooltip
					triggerProps={{ asChild: true }}
					contentProps={{ side: 'left' }}
					message={t('ns_common:actions.delete')}>
					<Button
						disabled={data?.mo_no === FALLBACK_ORDER_VALUE}
						type='button'
						variant='ghost'
						size='icon'
						onClick={() => onBeforeDelete(data?.mo_no)}>
						<Icon name='Trash2' className='stroke-destructive' />
					</Button>
				</Tooltip>
			</TableCell>
		</TableRow>
	)
}

export default OrderDetailTableRow
