import { cn } from '@common/utils/cn'
import { Div } from '@components/customs/div'
import { Typography } from '@components/customs/typography'
import { Button, buttonVariants } from '@components/ui/button'
import { Checkbox } from '@components/ui/checkbox'
import { Icon } from '@components/ui/icon'
import { Label } from '@components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover'
import type { OrderItem } from '@features/finished-goods/types'
import { PopoverClose } from '@radix-ui/react-popover'
import { useMemoizedFn } from 'ahooks'
import { useEffect, useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { usePageContext } from '../../../contexts/finished-goods-outbound/page-context'
import { useDeleteScanningMoMutation } from '../../../hooks/use-outbound-request'

const DeleteOrderPopover: React.FC<{ data: OrderItem; shouldClosePopover?: boolean }> = ({
	data,
	shouldClosePopover
}) => {
	const { t } = useTranslation()
	const id = useId()
	const [rescannable, setIsRescannable] = useState<boolean>(false)
	const { scannedOrders, setScannedOrders } = usePageContext('scannedOrders', 'setScannedOrders')
	const { mutateAsync: deleteOrderAsync, isPending: isDeleting } = useDeleteScanningMoMutation()
	const [popoverOpen, setPopoverOpen] = useState<boolean>(false)

	const handleDeleteOrder = useMemoizedFn(async () => {
		try {
			await deleteOrderAsync({ commandNumber: data.mo_no, rescannable })

			// * If all order is deleted, reset all
			const filteredOrders = scannedOrders.filter((item) => item?.mo_no !== data?.mo_no)
			setScannedOrders(filteredOrders)
			setPopoverOpen(false)
			toast.success(t('ns_common:notification.success'), { id: 'DELETE_UNEXPECTED_ORDER' })
		} catch {
			toast.error(t('ns_common:notification.error'), { id: 'DELETE_UNEXPECTED_ORDER' })
		}
	})

	useEffect(() => {
		if (shouldClosePopover) setPopoverOpen(false)
	}, [shouldClosePopover])

	return (
		<Popover modal={true} open={popoverOpen} onOpenChange={setPopoverOpen}>
			<PopoverTrigger
				className='[&:disabled>svg]:stroke-muted-foreground [&>svg]:stroke-destructive inline-flex size-6 items-center justify-center [&:disabled>svg]:cursor-not-allowed'
				role='button'>
				<Icon name='Trash2' />
			</PopoverTrigger>
			<PopoverContent align='center' className='w-96 space-y-6' side='left' sideOffset={16}>
				<Div className='space-y-1.5'>
					<Typography className='font-medium'>
						{t('ns_inoutbound:notification.confirm_delete_all_mono.title')}
					</Typography>
					<Typography variant='small'>
						{t('ns_inoutbound:notification.confirm_delete_all_mono.description')}
					</Typography>
				</Div>
				<Div className='flex items-center gap-x-2'>
					<Checkbox
						checked={rescannable}
						id={id}
						onCheckedChange={(checked) => setIsRescannable(Boolean(checked))}
					/>
					<Label htmlFor={id}>{t('ns_inoutbound:labels.delete_and_unscannable')}</Label>
				</Div>
				<Div className='flex items-stretch justify-end gap-x-1 *:basis-20'>
					<PopoverClose className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }))} disabled={isDeleting}>
						{t('ns_common:actions.cancel')}
					</PopoverClose>
					<Button disabled={isDeleting} size='sm' variant='destructive' onClick={handleDeleteOrder}>
						{isDeleting && <Icon className='animate-spin' name='LoaderCircle' />}
						{t('ns_common:actions.delete')}
					</Button>
				</Div>
			</PopoverContent>
		</Popover>
	)
}

export default DeleteOrderPopover
