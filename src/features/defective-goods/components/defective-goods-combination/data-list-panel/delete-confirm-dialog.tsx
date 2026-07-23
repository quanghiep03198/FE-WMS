import { CommonActions } from '@common/constants/enums'
import ConfirmDialog from '@components/ui/@override/confirm-dialog'
import { useResetState } from 'ahooks'
import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { usePageContext } from '../../../contexts/page-context'
import { useDeleteDefectiveGoodsMutation } from '../../../hooks/use-defective-goods-request'

const DeleteConfirmDialog: React.FC = () => {
	const { t } = useTranslation()
	const { event$ } = usePageContext()
	const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false)
	const [deleteId, setDeleteId, resetDeleteId] = useResetState<number | null>(null)
	const toastIdRef = useRef<string | number | null>(null)
	const { mutateAsync: deleteAsync, isPending, isError } = useDeleteDefectiveGoodsMutation()

	event$.useSubscription(({ action, payload }) => {
		const shouldDelete = action === CommonActions.DELETE && typeof payload === 'number'
		if (shouldDelete) {
			setConfirmDialogOpen(true)
			setDeleteId(payload)
		}
	})

	const handleDelete = useCallback(async () => {
		try {
			toastIdRef.current = toast.loading(t('ns_common:notification.processing_request'))
			await deleteAsync(deleteId)
			toast.success(t('ns_common:notification.success'), { id: toastIdRef.current })
			resetDeleteId()
			setConfirmDialogOpen(false)
		} catch {
			toast.error(t('ns_common:notification.error'), { id: toastIdRef.current })
		}
	}, [deleteId])

	return (
		<ConfirmDialog
			open={confirmDialogOpen || isPending || isError}
			onOpenChange={setConfirmDialogOpen}
			title={t('ns_common:confirmation.delete_title')}
			description={t('ns_common:confirmation.delete_description')}
			onConfirm={handleDelete}
			onCancel={resetDeleteId}
			dialogActionProps={{ variant: 'destructive', children: t('ns_common:actions.delete') }}
		/>
	)
}

export default DeleteConfirmDialog
