import { CommonActions } from '@common/constants/enums'
import ConfirmDialog from '@components/ui/@override/confirm-dialog'
import { useCallback, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { usePageContext } from '../contexts/page-context'
import {
	useDeleteDispatchOrdersMutation,
	useDeleteTruckloadPurchaseOrderMutation
} from '../hooks/use-truckload-delivery-request'
import type { TruckloadDeliveryDispatchOrder } from '../types'

const DeleteConfirmDialog: React.FC = () => {
	const { t } = useTranslation()
	const { event$ } = usePageContext()
	const {
		mutateAsync: deleteOne,
		isPending: isDeletingOne,
		isError: isFailedToDeleteOne
	} = useDeleteTruckloadPurchaseOrderMutation()
	const {
		mutateAsync: bulkDeleteByDispatchOrder,
		isPending: isDeletingMany,
		isError: isFailedToBulkDelete
	} = useDeleteDispatchOrdersMutation()
	const [shouldConfirmDialogOpen, setShouldConfirmDialogOpen] = useState<boolean>(false)
	const [action, setAction] = useState<CommonActions.DELETE | CommonActions.DELETE_MANY | null>(null)
	const [payload, setPayload] = useState<{
		po?: string
		dispatch_order: TruckloadDeliveryDispatchOrder
		index?: number
	} | null>(null)

	const isPending = isDeletingOne || isDeletingMany
	const isError = isFailedToDeleteOne || isFailedToBulkDelete

	event$.useSubscription(({ action, payload }) => {
		if (action !== CommonActions.DELETE && action !== CommonActions.DELETE_MANY) return
		setAction(action)
		setPayload(payload)
		setShouldConfirmDialogOpen(true)
	})

	const handleConfirm = useCallback(async () => {
		try {
			if (action === CommonActions.DELETE && payload?.po && payload?.dispatch_order) {
				return await deleteOne({
					po: payload?.po,
					dispatch_order: payload?.dispatch_order
				})
			}
			if (action === CommonActions.DELETE_MANY && payload?.dispatch_order) {
				return await bulkDeleteByDispatchOrder(payload.dispatch_order)
			}
		} finally {
			event$.emit({ action: 'RESET_DELIVERY_DETAILS', payload: payload?.index })
		}
	}, [action, payload])

	const handleCancel = () => {
		setAction(null)
		setPayload(null)
	}

	return createPortal(
		<ConfirmDialog
			description={t('ns_common:confirmation.delete_description')}
			isError={isError}
			isPending={isPending}
			open={shouldConfirmDialogOpen}
			title={t('ns_common:confirmation.delete_title')}
			onCancel={handleCancel}
			onConfirm={handleConfirm}
			onOpenChange={setShouldConfirmDialogOpen}
		/>,
		document.body
	)
}

export default DeleteConfirmDialog
