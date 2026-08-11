import { cn } from '@common/utils/cn'
import { Button, Icon } from '@components/ui'
import { useCheckoutInventoryAuditMutation } from '@features/inventory/hooks/use-inventory-audit-request'
import { Check, LoaderCircle } from 'lucide'
import { MorphIcon } from 'morphicons/react'
import React from 'react'
import { useTranslation } from 'react-i18next'

const CheckoutInventoryAuditButton: React.FC<{ isClosed: boolean }> = ({ isClosed }) => {
	const { t } = useTranslation()
	const { isPending, mutateAsync } = useCheckoutInventoryAuditMutation()

	return (
		<Button disabled={isClosed || isPending} onClick={() => mutateAsync()}>
			{isClosed ? (
				<Icon name='Check' className='stroke-success' />
			) : (
				<MorphIcon icon={isPending ? LoaderCircle : Check} size={16} className={cn(isPending && 'animate-spin')} />
			)}
			{isClosed
				? t('ns_common:status.confirmed')
				: t('inoutbound_actions.close_monthly_inventory', 'Close inventory')}
		</Button>
	)
}

export default CheckoutInventoryAuditButton
