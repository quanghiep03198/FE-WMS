import { Button, Icon, SheetClose } from '@/components/ui'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useArchivedRestorationContext } from '../../-contexts/archived-sheet-context'
import { useRestoreEpcMutation } from '../../-hooks'

const ArchivedListActions: React.FC = () => {
	const { t } = useTranslation()
	const { selectedItems, removeAllItemsFromSet } = useArchivedRestorationContext(
		'selectedItems',
		'removeAllItemsFromSet'
	)
	const { mutateAsync, isPending, isError } = useRestoreEpcMutation()

	const handleRestoreArchivedEpcs = async () => {
		const id = toast.loading(t('ns_common:notification.processing_request'))

		try {
			await mutateAsync(selectedItems.map((epc) => epc.epc))
			toast.success(t('ns_common:notification.success'), { id })
			removeAllItemsFromSet()
		} catch {
			toast.error(t('ns_common:notification.error'), { id })
		}
	}

	return (
		<Fragment>
			<Button disabled={!selectedItems.length || isPending} onClick={() => handleRestoreArchivedEpcs()}>
				{isPending && (
					<Icon name='LoaderCircle' className='animate-[spin_1s_linear_infinite]' role='presentation' />
				)}
				{isError ? t('ns_common:actions.retry') : t('ns_common:actions.restore')}
			</Button>
			<SheetClose asChild>
				<Button
					variant='outline'
					onClick={() => {
						removeAllItemsFromSet()
					}}>
					{t('ns_common:actions.cancel')}
				</Button>
			</SheetClose>
		</Fragment>
	)
}

export default ArchivedListActions
