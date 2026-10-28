import { CommonActions } from '@common/constants/enums'
import ConfirmDialog from '@components/customs/confirm-dialog'
import { useResetState } from 'ahooks'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePageContext } from '../../../contexts/page-context'
import { useDeleteDefectiveGoodsMutation } from '../../../hooks/use-defective-goods-request'

const DeleteConfirmDialog: React.FC = () => {
	const { t } = useTranslation()
	const { event$ } = usePageContext()
	const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false)
	const [deleteId, setDeleteId, resetDeleteId] = useResetState<Nullish<string>>(null)
	const { mutateAsync: deleteAsync, isPending, isError } = useDeleteDefectiveGoodsMutation()

	event$.useSubscription(({ action, payload }) => {
		const shouldDelete = action === CommonActions.DELETE && typeof payload === 'string'
		if (shouldDelete) {
			setConfirmDialogOpen(true)
			setDeleteId(payload)
		}
	})

	const handleDelete = useCallback(async () => {
		if (!deleteId) return
		await deleteAsync(deleteId)
		resetDeleteId()
		setConfirmDialogOpen(false)
	}, [deleteId])

	return (
		<ConfirmDialog
			description={t('ns_common:confirmation.delete_description')}
			dialogActionProps={{ variant: 'destructive', children: t('ns_common:actions.delete') }}
			open={confirmDialogOpen || isPending || isError}
			title={t('ns_common:confirmation.delete_title')}
			onCancel={resetDeleteId}
			onConfirm={handleDelete}
			onOpenChange={setConfirmDialogOpen}
		/>
	)
}

export default DeleteConfirmDialog
