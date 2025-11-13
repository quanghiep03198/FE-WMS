import { CommonActions } from '@/common/constants/enums'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui'
import { useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { usePageContext } from '../-contexts/page-context'

type Props = {}

const CreatePoFormDialog = (props: Props) => {
	const { t } = useTranslation()
	const [open, setOpen] = useState<boolean>(false)
	const { event$ } = usePageContext()
	const form = useForm({})
	const { fields, append, remove, move } = useFieldArray({ control: form.control, name: 'outbound_purchase_orders' })

	event$.useSubscription(({ action, payload }) => {
		if (action !== CommonActions.CREATE) return
		setOpen(true)
	})

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{t('ns_inoutbound:titles.create_truckload_delivery')}</DialogTitle>
					<DialogDescription>{t('ns_inoutbound:description.create_truckload_delivery')}</DialogDescription>
				</DialogHeader>
			</DialogContent>
		</Dialog>
	)
}

export default CreatePoFormDialog
