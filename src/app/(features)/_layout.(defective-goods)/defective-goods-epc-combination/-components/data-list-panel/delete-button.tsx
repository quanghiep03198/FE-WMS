import { Button, ButtonProps, Icon, Tooltip } from '@/components/ui'
import ConfirmDialog from '@/components/ui/@override/confirm-dialog'
import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useDeleteManyDefectiveGoodsMutation } from '../../../-hooks/use-defective-goods-asm'

const DeleteButton: React.FC<ButtonProps & { selectedItems: Set<number>; onAfterDelete: () => void }> = ({
	disabled,
	selectedItems,
	onAfterDelete
}) => {
	const { t } = useTranslation()
	const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false)

	const { mutateAsync: deleteAsync, isPending, isError, reset } = useDeleteManyDefectiveGoodsMutation()
	return (
		<Fragment>
			<Tooltip message={t('ns_common:actions.delete')} triggerProps={{ asChild: true }}>
				<Button
					size='icon'
					variant='ghost'
					className='[&:disabled_svg]:stroke-muted-foreground [&_svg]:stroke-destructive'
					disabled={disabled}
					onClick={() => setConfirmDialogOpen(true)}>
					<Icon name='Trash2' />
				</Button>
			</Tooltip>
			<ConfirmDialog
				open={confirmDialogOpen || isPending || isError}
				onOpenChange={setConfirmDialogOpen}
				isPending={isPending}
				isError={isError}
				title={t('ns_common:confirmation.delete_title')}
				description={t('ns_common:confirmation.delete_description')}
				onConfirm={() =>
					toast.promise(deleteAsync(Array.from(selectedItems)), {
						loading: t('ns_common:notification.processing_request'),
						success: () => {
							onAfterDelete()
							return t('ns_common:notification.success')
						},
						error: t('ns_common:notification.error')
					})
				}
				onCancel={() => {
					reset()
					setConfirmDialogOpen(false)
				}}
			/>
		</Fragment>
	)
}

export default DeleteButton
