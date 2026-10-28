import ConfirmDialog from '@components/customs/confirm-dialog'
import { Tooltip } from '@components/customs/tooltip'
import type { ButtonProps } from '@components/ui/button'
import { Button } from '@components/ui/button'
import { Icon } from '@components/ui/icon'
import { useSearchDefectiveGoods } from '@features/defective-goods/hooks/use-search-defective-goods'
import { isEmpty, isNil, pickBy } from 'lodash-es'
import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useListPanelContext } from '../../../contexts/list-panel-context'
import { useDeleteManyDefectiveGoodsMutation } from '../../../hooks/use-defective-goods-request'

const DeleteButton: React.FC<ButtonProps> = () => {
	const { t } = useTranslation()
	const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false)
	const { selectionState, getSelectedIds, getDeselectedIds, getSelectedCount, clearSelection } = useListPanelContext()
	const [searchTerms] = useSearchDefectiveGoods()

	const { mutateAsync: deleteAsync, isPending, isError, reset } = useDeleteManyDefectiveGoodsMutation()

	// Check if any items are selected
	const selectedCount = getSelectedCount()
	const hasSelection = selectedCount > 0

	// Get IDs for deletion
	const getDeletePayload = () => {
		switch (selectionState.mode) {
			case 'all':
				return { including_ids: 'all' }
			case 'all-except':
				return { including_ids: 'all', excluding_ids: getDeselectedIds() }
			case 'some':
				return { including_ids: getSelectedIds(), excluding_ids: getDeselectedIds() }
			default:
				return null
		}
	}

	return (
		<Fragment>
			<Tooltip message={t('ns_common:actions.delete')} triggerProps={{ asChild: true }}>
				<Button
					className='[&:disabled_svg]:stroke-muted-foreground [&_svg]:stroke-destructive'
					disabled={!hasSelection}
					size='icon'
					variant='ghost'
					onClick={() => setConfirmDialogOpen(true)}>
					<Icon name='Trash2' />
				</Button>
			</Tooltip>
			<ConfirmDialog
				description={t('ns_common:confirmation.delete_description')}
				dialogActionProps={{ variant: 'destructive', children: t('ns_common:actions.delete') }}
				isError={isError}
				isPending={isPending}
				open={confirmDialogOpen || isPending || isError}
				title={t('ns_common:confirmation.delete_title')}
				onOpenChange={setConfirmDialogOpen}
				onCancel={() => {
					reset()
					setConfirmDialogOpen(false)
				}}
				onConfirm={() =>
					toast.promise(
						deleteAsync({
							...getDeletePayload(),
							...pickBy(searchTerms, (item) => !isEmpty(item) && !isNil(item))
						} as Parameter<typeof deleteAsync>),
						{
							loading: t('ns_common:notification.processing_request'),
							success: () => {
								clearSelection()
								return t('ns_common:notification.success')
							},
							error: t('ns_common:notification.error')
						}
					)
				}
			/>
		</Fragment>
	)
}

export default DeleteButton
