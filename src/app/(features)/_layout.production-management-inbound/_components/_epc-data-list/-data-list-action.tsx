import { Button, Icon } from '@/components/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useUpdateStockMutation } from '../../_apis/rfid.api'
import { usePageContext } from '../../_contexts/-page-context'

const DataListAction: React.FC = () => {
	const { t } = useTranslation()
	const { scannedOrders } = usePageContext('scannedOrders')

	const { mutateAsync, isPending } = useUpdateStockMutation()

	const handleUpdateStock = () => {
		console.log(scannedOrders)
		toast.promise(mutateAsync(scannedOrders), {
			loading: t('ns_common:notification.processing_request'),
			success: t('ns_common:notification.success'),
			error: t('ns_common:notification.error')
		})
	}

	return (
		<Button disabled={isPending} onClick={handleUpdateStock}>
			{isPending ? (
				<Icon name='LoaderCircle' className='animate-spin' size={20} role='img' />
			) : (
				<Icon name='BaggageClaim' role='img' size={20} />
			)}
			Confirm
		</Button>
	)
}

export default DataListAction
