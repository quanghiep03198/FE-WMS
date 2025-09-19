import { Button, ButtonProps, Icon, Tooltip } from '@/components/ui'
import ConfirmDialog from '@/components/ui/@override/confirm-dialog'
import { useSessionStorageState } from 'ahooks'
import { isEmpty, isNil, pickBy } from 'lodash'
import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useListPanelContext } from '../../-contexts/list-panel-context'
import { DefectiveGoodQueryParams } from '../../-schemas/defective-goods.schema'
import { useDeleteManyDefectiveGoodsMutation } from '../../../-hooks/use-defective-goods-asm'

const DeleteButton: React.FC<ButtonProps> = () => {
	const { t } = useTranslation()
	const [confirmDialogOpen, setConfirmDialogOpen] = useState<boolean>(false)
	const { isAllItemsSelected: checked, selectedItems, resetSelectedItems } = useListPanelContext()
	const [searchTerms] = useSessionStorageState<Omit<DefectiveGoodQueryParams, 'page'>>('defectiveGoodsSearchTerms', {
		listenStorageChange: true
	})

	const { mutateAsync: deleteAsync, isPending, isError, reset } = useDeleteManyDefectiveGoodsMutation()
	return (
		<Fragment>
			<Tooltip message={t('ns_common:actions.delete')} triggerProps={{ asChild: true }}>
				<Button
					size='icon'
					variant='ghost'
					className='[&:disabled_svg]:stroke-muted-foreground [&_svg]:stroke-destructive'
					disabled={selectedItems.length === 0 && !checked}
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
					toast.promise(
						deleteAsync({
							ids: checked ? 'all' : selectedItems,
							...pickBy(searchTerms, (item) => !isEmpty(item) && !isNil(item))
						} as Parameter<typeof deleteAsync>),
						{
							loading: t('ns_common:notification.processing_request'),
							success: () => {
								resetSelectedItems()
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
