import type { TruckloadDeliveryDispatchOrder } from '@/features/truckload-delivery/services/truckload-delivery.service'
import { CommonActions } from '@common/constants/enums'
import ConfirmDialog from '@components/ui/@override/confirm-dialog'
import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { usePageContext } from '../contexts/page-context'
import {
	useDeleteDispatchOrdersMutation,
	useDeleteTruckloadDeliveryMutation
} from '../hooks/use-truckload-delivery-asm'

const DeleteConfirmDialog: React.FC = () => {
	const { t } = useTranslation()
	const { event$ } = usePageContext()
	const {
		mutateAsync: deleteOneById,
		isPending: isDeletingOne,
		isError: isFailedToDeleteOne
	} = useDeleteTruckloadDeliveryMutation()
	const {
		mutateAsync: bulkDeleteByDispatchOrder,
		isPending: isDeletingMany,
		isError: isFailedToBulkDelete
	} = useDeleteDispatchOrdersMutation()
	const [shouldConfirmDialogOpen, setShouldConfirmDialogOpen] = useState<boolean>(false)
	const currentlyDeletingIdsRef = useRef<number>(null)
	const currentlyDeletingDispatchOrdersRef = useRef<TruckloadDeliveryDispatchOrder>(null)

	const isPending = isDeletingOne || isDeletingMany
	const isError = isFailedToDeleteOne || isFailedToBulkDelete

	event$.useSubscription(({ action, payload }) => {
		if (action === CommonActions.DELETE) {
			setShouldConfirmDialogOpen(true)
			currentlyDeletingIdsRef.current = typeof payload === 'number' ? payload : null
			currentlyDeletingDispatchOrdersRef.current = null
		}
		if (action === CommonActions.DELETE_MANY) {
			setShouldConfirmDialogOpen(true)
			currentlyDeletingDispatchOrdersRef.current = typeof payload === 'string' ? payload : null
			currentlyDeletingIdsRef.current = null
		}
	})

	return createPortal(
		<ConfirmDialog
			title={t('ns_common:confirmation.delete_title')}
			description={t('ns_common:confirmation.delete_description')}
			open={shouldConfirmDialogOpen}
			onOpenChange={setShouldConfirmDialogOpen}
			onConfirm={() => {
				if (typeof currentlyDeletingIdsRef.current === 'number') {
					return deleteOneById(currentlyDeletingIdsRef.current)
				}
				if (typeof currentlyDeletingDispatchOrdersRef.current === 'string') {
					return bulkDeleteByDispatchOrder(currentlyDeletingDispatchOrdersRef.current)
				}
			}}
			onCancel={() => {
				currentlyDeletingIdsRef.current = null
				currentlyDeletingDispatchOrdersRef.current = null
			}}
			isPending={isPending}
			isError={isError}
		/>,
		document.body
	)
}

export default DeleteConfirmDialog
