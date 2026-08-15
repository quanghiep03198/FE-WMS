import { Button } from '@components/ui'
import { useCheckoutInventoryAuditMutation } from '@features/inventory/hooks/use-inventory-audit-request'
import { Lock, LockOpen } from 'lucide'
import { MorphIcon } from 'morphicons/react'
import React from 'react'
import { useTranslation } from 'react-i18next'

const CheckoutInventoryAuditButton: React.FC<{ isClosed: boolean }> = ({ isClosed }) => {
	const { t } = useTranslation()
	const { isPending, mutateAsync } = useCheckoutInventoryAuditMutation()

	return (
		<Button
			aria-disabled={isPending}
			className='aria-disabled:pointer-events-none aria-disabled:opacity-50'
			onClick={() => {
				if (isClosed) return
				mutateAsync()
			}}>
			<MorphIcon icon={!isClosed ? LockOpen : Lock} size={16} spring='smooth' />

			{isClosed
				? t('ns_common:status.confirmed')
				: t('inoutbound_actions.close_monthly_inventory', 'Close inventory')}
		</Button>
	)
}

export default CheckoutInventoryAuditButton
