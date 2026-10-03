import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogMedia,
	AlertDialogTitle,
	AlertDialogTrigger,
	Button,
	Icon
} from '@components/ui'
import { useCheckoutInventoryAuditMutation } from '@features/inventory/hooks/use-inventory-audit-request'
import { Lock, LockOpen } from 'lucide'
import { MorphIcon } from 'morphicons/react'
import React from 'react'
import { useTranslation } from 'react-i18next'

const CheckoutInventoryAuditConfirmDialog: React.FC<{ isClosed: boolean }> = ({ isClosed }) => {
	const { t } = useTranslation()
	const { isPending, mutateAsync } = useCheckoutInventoryAuditMutation()

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button disabled={isPending || isClosed}>
					<MorphIcon icon={!isClosed ? LockOpen : Lock} size={16} spring='smooth' />
					{isClosed
						? t('ns_common:status.confirmed')
						: t('inoutbound_actions.close_monthly_inventory', 'Close inventory')}
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader className='grid grid-cols-[auto_1fr] gap-x-6'>
					<AlertDialogMedia className='bg-destructive/20 col-start-1 row-span-2 size-12 rounded-full'>
						<Icon name='TriangleAlert' size={20} stroke='var(--destructive)' strokeWidth={1.5} />
					</AlertDialogMedia>
					<AlertDialogTitle className='col-start-2'>
						{t('ns_inoutbound:titles.close_monthly_inventory')}
					</AlertDialogTitle>
					<AlertDialogDescription className='col-start-2'>
						{t('ns_inoutbound:description.close_monthly_inventory')}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>{t('ns_common:actions.cancel')}</AlertDialogCancel>
					<AlertDialogAction onClick={() => mutateAsync()}>{t('ns_common:actions.confirm')}</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

export default CheckoutInventoryAuditConfirmDialog
