import { CommonActions } from '@/common/constants/enums'
import {
	Button,
	buttonVariants,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	Form as FormProvider,
	Icon,
	InputFieldControl
} from '@/components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { pick } from 'lodash'
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { usePageContext } from '../-contexts/page-context'
import { useUpdateDispatchOrderMutation } from '../-hooks/use-truckload-delivery-asm'
import { updateDeliverySchema, UpdateDispatchOrderFormValues } from '../-schemas'

const TruckloadDeliveryFormDialog: React.FC = () => {
	const [open, setOpen] = useState(false)
	const { event$ } = usePageContext()
	const { t } = useTranslation()

	const form = useForm<UpdateDispatchOrderFormValues>({
		resolver: zodResolver(updateDeliverySchema)
	})
	const [action, setAction] = useState<CommonActions>(null)

	const toastRef = useRef<string | number | null>(null)

	const { mutateAsync, isPending, isError } = useUpdateDispatchOrderMutation()

	event$.useSubscription(({ action, payload }) => {
		if (action !== CommonActions.UPDATE_MANY) return
		setAction(action)
		setOpen(true)
		form.reset(pick(payload, ['dispatch_order', 'license_plate', 'container_number']))
	})

	const handleSaveChanges = async (data: UpdateDispatchOrderFormValues) => {
		toastRef.current = toast.loading(t('ns_common:notification.processing_request'))
		try {
			await mutateAsync(data)
			toast.success(t('ns_common:notification.success'), { id: toastRef.current })
			setOpen(false)
		} catch {
			toast.error(t('ns_common:notification.error'), { id: toastRef.current })
		}
	}

	return (
		<Dialog
			defaultOpen={false}
			open={open}
			onOpenChange={(open) => {
				setOpen(open)
			}}>
			<DialogContent className={action === CommonActions.UPDATE ? 'max-w-2xl' : 'max-w-lg'}>
				<DialogHeader>
					<DialogTitle>{t('ns_inoutbound:titles.update_truckload_delivery')}</DialogTitle>
					<DialogDescription>{t('ns_inoutbound:description.update_truckload_delivery')}</DialogDescription>
				</DialogHeader>
				<FormProvider {...form}>
					<Form onSubmit={form.handleSubmit(handleSaveChanges)}>
						<FieldSet>
							<InputFieldControl
								label={t('ns_erp:fields.container_number')}
								name='container_number'
								placeholder='e.g., ABCU1234567'
								description='BIC container code format. Skip this field in case container number is not available now.'
								onChange={(e) => {
									form.setValue('container_number', e.currentTarget.value.toUpperCase())
								}}
							/>
							<InputFieldControl
								label={t('ns_erp:fields.license_plate')}
								name='license_plate'
								placeholder='e.g., ABC-12345'
								description='License plate that coresponding to container number. Also skip entering license plate if container number is unknown.'
								onChange={(e) => form.setValue('license_plate', e.currentTarget.value.toUpperCase())}
							/>
						</FieldSet>
						<DialogFooter className='mt-4 justify-end'>
							<Button>
								<Icon name={isPending ? 'LoaderCircle' : 'Check'} className={isPending && 'animate-spin'} />
								{isError ? t('ns_common:actions.retry') : t('ns_common:actions.save_changes')}
							</Button>
							<DialogClose className={buttonVariants({ variant: 'secondary' })}>
								<Icon name='X' />
								{t('ns_common:actions.cancel')}
							</DialogClose>
						</DialogFooter>
					</Form>
				</FormProvider>
			</DialogContent>
		</Dialog>
	)
}

export const Form = tw.form`grid gap-4`
export const FieldSet = tw.fieldset`flex flex-col gap-y-6`

export default TruckloadDeliveryFormDialog

{
	/* <Div className='col-span-1'>
	<DatePickerFieldControl
		label={t('ns_erp:fields.factory_departure_date')}
		name='factory_departure_time.date'
	/>
</Div>
<Div className='col-span-1'>
	<InputFieldControl
		type='time'
		step={3600}
		min='00:00'
		max='23:59'
		pattern='[0-2][0-9]:[0-5][0-9]'
		label={t('ns_erp:fields.factory_departure_time')}
		name='factory_departure_time.time'
		defaultValue={format(new Date(), 'HH:mm')}
	/>
</Div> */
}
