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
import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { usePageContext } from '../-contexts/page-context'
import { useUpdateDispatchOrderMutation } from '../-hooks/use-truckload-delivery-asm'
import { UpdateDispatchOrderFormValues, updateDispatchOrderSchema } from '../-schemas'

const UpdateDispatchOrderFormDialog: React.FC = () => {
	const [open, setOpen] = useState(false)
	const { event$ } = usePageContext()
	const { t } = useTranslation()
	const form = useForm<UpdateDispatchOrderFormValues>({
		resolver: zodResolver(updateDispatchOrderSchema)
	})
	const { mutateAsync, isPending, isError } = useUpdateDispatchOrderMutation()
	const toastRef = useRef<string | number | null>(null)

	event$.useSubscription(({ action, payload }) => {
		if (action !== CommonActions.UPDATE_MANY) return
		setOpen(true)
		form.reset(payload)
	})

	const handleSaveChanges = async (data: UpdateDispatchOrderFormValues) => {
		toastRef.current = toast.loading(t('ns_common:notification.processing_request'))
		try {
			await mutateAsync(data)
			toast.success(t('ns_common:notification.success'), { id: toastRef.current })
			setOpen(false)
			form.reset()
		} catch {
			toast.error(t('ns_common:notification.error'), { id: toastRef.current })
		}
	}

	return (
		<Dialog defaultOpen={false} open={open} onOpenChange={setOpen}>
			<DialogContent className='max-w-lg'>
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
								description={t('ns_inoutbound:description.container_number_field')}
								onChange={(e) => {
									form.setValue('container_number', e.currentTarget.value.toUpperCase())
								}}
							/>
							<InputFieldControl
								label={t('ns_erp:fields.license_plate')}
								name='license_plate'
								placeholder='e.g., ABC-12345'
								description={t('ns_inoutbound:description.license_plate_field')}
								onChange={(e) => form.setValue('license_plate', e.currentTarget.value.toUpperCase())}
							/>
						</FieldSet>
						<DialogFooter className='mt-4 justify-end'>
							<DialogClose className={buttonVariants({ variant: 'secondary' })}>
								<Icon name='X' />
								{t('ns_common:actions.cancel')}
							</DialogClose>
							<Button>
								<Icon name={isPending ? 'LoaderCircle' : 'Check'} className={isPending && 'animate-spin'} />
								{isError ? t('ns_common:actions.retry') : t('ns_common:actions.save_changes')}
							</Button>
						</DialogFooter>
					</Form>
				</FormProvider>
			</DialogContent>
		</Dialog>
	)
}

export const Form = tw.form`flex flex-col gap-y-4`
export const FieldSet = tw.fieldset`flex flex-col gap-y-6`

export default UpdateDispatchOrderFormDialog

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
