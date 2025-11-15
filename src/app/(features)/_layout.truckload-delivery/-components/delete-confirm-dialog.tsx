import { CommonActions } from '@/common/constants/enums'
import ConfirmDialog from '@/components/ui/@override/confirm-dialog'
import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { usePageContext } from '../-contexts/page-context'
import { useDeleteTruckloadDeliveryMutation } from '../-hooks/use-truckload-delivery-asm'

const DeleteConfirmDialog: React.FC = () => {
	const { t } = useTranslation()
	const { event$ } = usePageContext()
	const { mutateAsync, isPending, isError } = useDeleteTruckloadDeliveryMutation()
	const [shouldConfirmDialogOpen, setShouldConfirmDialogOpen] = useState<boolean>(false)
	const currentlyDeletingIdsRef = useRef<number>(null)

	event$.useSubscription(({ action, payload }) => {
		if (action === CommonActions.DELETE) console.log(payload)
		setShouldConfirmDialogOpen(typeof payload === 'number')
		currentlyDeletingIdsRef.current = typeof payload === 'number' ? payload : null
	})

	return createPortal(
		<ConfirmDialog
			title='Confirm Deletion'
			description='Are you sure you want to delete the selected truckload deliveries? This action cannot be undone.'
			open={shouldConfirmDialogOpen}
			onOpenChange={setShouldConfirmDialogOpen}
			onConfirm={() => mutateAsync({ id: currentlyDeletingIdsRef.current, shouldPermanentlyDelete: true })}
			onCancel={() => {
				currentlyDeletingIdsRef.current = null
			}}
			isPending={isPending}
			isError={isError}
		/>,
		document.body
	)
}

export default DeleteConfirmDialog
