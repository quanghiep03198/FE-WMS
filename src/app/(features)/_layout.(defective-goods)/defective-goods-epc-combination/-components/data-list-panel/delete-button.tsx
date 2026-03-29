import type { ButtonProps } from '@/components/ui'
import { Button, Icon, Tooltip } from '@/components/ui'
import ConfirmDialog from '@/components/ui/@override/confirm-dialog'
import { useSessionStorageState } from 'ahooks'
import { isEmpty, isNil, pickBy } from 'lodash-es'
import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { PERSISTENT_DEFECTIVE_GOODS_SEARCH_TERMS_KEY } from '../../-constants'
import { useListPanelContext } from '../../-contexts/list-panel-context'
import type { DefectiveGoodQueryParams } from '../../-schemas/defective-goods.schema'
import { useDeleteManyDefectiveGoodsMutation } from '../../../-hooks/use-defective-goods-asm'

const DeleteButton: React.FC<ButtonProps> = () => {
	const { t } = useTranslation()
	const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false)
	const { selectionState, getSelectedIds, getDeselectedIds, getSelectedCount, clearSelection } = useListPanelContext()
	const [searchTerms] = useSessionStorageState<Omit<DefectiveGoodQueryParams, 'page'>>(
		PERSISTENT_DEFECTIVE_GOODS_SEARCH_TERMS_KEY,
		{
			listenStorageChange: true
		}
	)

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
					size='icon'
					variant='ghost'
					className='[&:disabled_svg]:stroke-muted-foreground [&_svg]:stroke-destructive'
					disabled={!hasSelection}
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
				dialogActionProps={{ variant: 'destructive', children: t('ns_common:actions.delete') }}
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
				onCancel={() => {
					reset()
					setConfirmDialogOpen(false)
				}}
			/>
		</Fragment>
	)
}

export default DeleteButton
