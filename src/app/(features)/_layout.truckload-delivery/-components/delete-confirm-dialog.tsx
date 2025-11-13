import { CommonActions } from '@/common/constants/enums'
import { Button, Icon } from '@/components/ui'
import ConfirmDialog from '@/components/ui/@override/confirm-dialog'
import { Fragment, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { usePageContext } from '../-contexts/page-context'

const DeleteConfirmDialog: React.FC = () => {
	const { t } = useTranslation()
	const { event$ } = usePageContext()
	const ref = useRef<HTMLButtonElement>(null)
	const [shouldShowDeleteButton, setShouldShowDeleteButton] = useState<boolean>(false)
	const [shouldConfirmDialogOpen, setShouldConfirmDialogOpen] = useState<boolean>(false)

	event$.useSubscription(({ action, payload }) => {
		console.log(payload)
		if (action !== CommonActions.DELETE) return
		setShouldShowDeleteButton(Array.isArray(payload) && payload.length > 0)
		setShouldConfirmDialogOpen(typeof payload === 'number')
	})

	return (
		<Fragment>
			<Button
				variant='destructive'
				ref={ref}
				className={!shouldShowDeleteButton && 'hidden'}
				onClick={() => setShouldConfirmDialogOpen(true)}>
				<Icon name='Trash2' />
				{t('ns_common:actions.delete')}
			</Button>
			{createPortal(
				<ConfirmDialog
					title='Confirm Deletion'
					description='Are you sure you want to delete the selected truckload deliveries? This action cannot be undone.'
					open={shouldConfirmDialogOpen}
					onOpenChange={setShouldConfirmDialogOpen}
					onConfirm={() => {}}
				/>,
				document.body
			)}
		</Fragment>
	)
}

export default DeleteConfirmDialog
