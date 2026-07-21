import {
	Button,
	buttonVariants,
	Checkbox,
	Div,
	Icon,
	Label,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Typography
} from '@/components/ui'
import { cn } from '@common/utils/cn'
import { PopoverClose } from '@radix-ui/react-popover'
import { useMemoizedFn } from 'ahooks'
import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { usePageContext } from '../../../contexts/finished-goods-inbound/page-context'
import { useDeleteScanningMoMutation } from '../../../hooks/use-inbound-request'

const DeleteOrderPopover: React.FC<{ data: { mo_no: string } }> = ({ data }) => {
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

	return (
		<Popover open={popoverOpen} onOpenChange={setPopoverOpen} modal={true}>
			<PopoverTrigger
				role='button'
				className='[&:disabled>svg]:stroke-muted-foreground [&>svg]:stroke-destructive inline-flex size-6 items-center justify-center [&:disabled>svg]:cursor-not-allowed'>
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
				<Div className='flex items-center gap-x-2'>
					<Checkbox
						id={id}
						checked={rescannable}
						onCheckedChange={(checked) => setIsRescannable(Boolean(checked))}
					/>
					<Label htmlFor={id}>{t('ns_inoutbound:labels.delete_and_unscannable')}</Label>
				</Div>
				<Div className='flex items-stretch justify-end gap-x-1 *:basis-20'>
					<PopoverClose disabled={isDeleting} className={cn(buttonVariants({ variant: 'secondary', size: 'sm' }))}>
						{t('ns_common:actions.cancel')}
					</PopoverClose>
					<Button disabled={isDeleting} variant='destructive' size='sm' onClick={handleDeleteOrder}>
						{isDeleting && <Icon name='LoaderCircle' className='animate-spin' />}
						{t('ns_common:actions.delete')}
					</Button>
				</Div>
			</PopoverContent>
		</Popover>
	)
}

export default DeleteOrderPopover
