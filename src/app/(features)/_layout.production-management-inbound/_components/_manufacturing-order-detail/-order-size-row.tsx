import { cn } from '@/common/utils/cn'
import {
	Button,
	buttonVariants,
	Div,
	Icon,
	Popover,
	PopoverContent,
	PopoverTrigger,
	TableCell,
	TableHead,
	TableRow,
	Typography
} from '@/components/ui'
import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
// import { FALLBACK_ORDER_VALUE, useDeleteOrderMutation } from '../../_apis/rfid.api'
// import { useOrderDetailContext } from '../../_contexts/-order-detail-context'
import { FALLBACK_ORDER_VALUE } from '@/app/(features)/_layout.finished-production-inoutbound/_apis/rfid.api'
import useQueryParams from '@/common/hooks/use-query-params'
import { PopoverClose } from '@radix-ui/react-popover'
import { useMemoizedFn } from 'ahooks'
import { toast } from 'sonner'
import { useDeletePMOrderMutation } from '../../_apis/rfid.api'
import { ProducingProcessSuffix } from '../../_constants/index.const'
import { OrderSize } from '../../_contexts/-page-context'

type OrderDetailTableRowProps = {
	orderCode: string
	sizeList: Array<OrderSize>
}

const OrderDetailTableRow: React.FC<OrderDetailTableRowProps> = ({ orderCode, sizeList }) => {
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
		<TableRow className={cn('transition-all duration-500')}>
			<TableCell
				align='left'
				className='group/cell left-0 z-10 space-y-1 xl:sticky xl:min-w-[var(--sticky-col-width)]'>
				{orderCode === 'null' ? FALLBACK_ORDER_VALUE : orderCode}
			</TableCell>
			<TableCell
				align='left'
				className='z-10 border-r-0 drop-shadow-[1px_0px_hsl(var(--border))] xl:sticky xl:left-[var(--sticky-col-width)] xl:min-w-[var(--sticky-col-width)]'>
				{sizeList[0]?.shoes_style_code_factory ?? FALLBACK_ORDER_VALUE}
			</TableCell>
			<TableCell className={cn('!p-0')}>
				<Div
					className='flex flex-grow border-collapse flex-nowrap divide-x'
					onContextMenu={(e) => e.preventDefault()}>
					{sizeList?.map((size) => (
						<Div
							key={size?.size_numcode ?? FALLBACK_ORDER_VALUE}
							className='group/cell inline-grid min-w-16 shrink-0 basis-16 grid-rows-2 divide-y last:flex-1'>
							<TableHead align='left' className='bg-table-head'>
								{size?.size_numcode ?? FALLBACK_ORDER_VALUE}
							</TableHead>
							<TableCell>{size?.count ?? 0}</TableCell>
						</Div>
					))}
				</Div>
			</TableCell>
			<TableCell align='right' className='font-medium xl:sticky xl:right-12'>
				{aggregateSizeCount}
			</TableCell>
			<TableCell align='center' className='right-0 xl:sticky xl:w-12 xl:min-w-12'>
				<DeleteOrderPopoverConfirm orderToDelete={orderCode} />
			</TableCell>
		</TableRow>
	)
}

const DeleteOrderPopoverConfirm: React.FC<{ orderToDelete: string }> = memo(
	({ orderToDelete }) => {
		const { t } = useTranslation()

		const { searchParams } = useQueryParams<{ process: ProducingProcessSuffix }>()
		const { mutateAsync: deleteOrder, isPending: isDeleting } = useDeletePMOrderMutation()

		const handleDeleteOrder = useMemoizedFn((orderCode: string) => {
			toast.promise(deleteOrder({ process: searchParams.process, order: orderCode }), {
				loading: t('ns_common:notification.processing_request'),
				success: t('ns_common:notification.success'),
				error: t('ns_common:notification.error')
			})
		})

		return (
			<Popover modal>
				<PopoverTrigger
					disabled={orderToDelete === FALLBACK_ORDER_VALUE}
					className='[&:disabled>svg]:cursor-not-allowed [&:disabled>svg]:stroke-muted-foreground [&>svg]:stroke-destructive'>
					<Icon name='Trash2' />
				</PopoverTrigger>
				<PopoverContent className='w-96 space-y-6' side='left' align='center' sideOffset={16}>
					<Div className='space-y-1.5'>
						<Typography className='font-medium'>
							{t('ns_inoutbound:notification.confirm_delete_all_mono.title')}
						</Typography>
						<Typography variant='small'>
							{t('ns_inoutbound:notification.confirm_delete_all_mono.description')}
						</Typography>
					</Div>
					<Div className='flex items-stretch justify-end gap-x-1 *:basis-20'>
						<PopoverClose
							disabled={isDeleting}
							className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }))}>
							{t('ns_common:actions.cancel')}
						</PopoverClose>
						<Button
							disabled={isDeleting}
							variant='destructive'
							size='sm'
							onClick={() => handleDeleteOrder(orderToDelete)}>
							{isDeleting && <Icon name='LoaderCircle' role='img' className='animate-spin' />}
							{t('ns_common:actions.delete')}
						</Button>
					</Div>
				</PopoverContent>
			</Popover>
		)
	},
	(prev, next) => prev.orderToDelete === next.orderToDelete
)

export default OrderDetailTableRow
