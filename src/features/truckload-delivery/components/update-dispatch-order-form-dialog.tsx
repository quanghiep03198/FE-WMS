import { CommonActions } from '@common/constants/enums'
import {
	Button,
	buttonVariants,
	Checkbox,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	Field,
	FieldDescription,
	FieldGroup,
	FieldLegend,
	FieldSeparator,
	FieldSet,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	Form as FormProvider,
	Icon,
	InputFieldControl,
	TextareaFieldControl
} from '@components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import useMediaQuery from '@hooks/use-media-query'
import { capitalize } from 'lodash-es'
import { Fragment, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { usePageContext } from '../contexts/page-context'
import { useUpdateDispatchOrderMutation } from '../hooks/use-truckload-delivery-asm'
import type { UpdateDispatchOrderFormValues } from '../schemas'
import { updateDispatchOrderSchema } from '../schemas'

const UpdateDispatchOrderFormDialog: React.FC = () => {
	const [open, setOpen] = useState(false)
	const { event$ } = usePageContext()
	const { t } = useTranslation()
	const form = useForm<UpdateDispatchOrderFormValues>({
		resolver: zodResolver(updateDispatchOrderSchema)
	})
	const isMobile = useMediaQuery('(max-width: 1023px)')
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
			<DialogContent className='max-h-[80vh] max-w-lg scrollbar-none overflow-auto'>
				<DialogHeader>
					<DialogTitle>{t('ns_inoutbound:titles.update_truckload_delivery')}</DialogTitle>
					<DialogDescription>{t('ns_inoutbound:description.update_truckload_delivery')}</DialogDescription>
				</DialogHeader>
				<FormProvider {...form}>
					<Form onSubmit={form.handleSubmit(handleSaveChanges)}>
						<FieldGroup>
							<FieldSet>
								<InputFieldControl
									label={t('ns_erp:fields.container_number')}
									name='container_number'
									placeholder='e.g., ABCU1234567'
									description={t('ns_inoutbound:description.container_number_field')}
									onChange={(e) => {
										form.setValue('container_number', e.currentTarget.value.toUpperCase() || null)
									}}
								/>
								<InputFieldControl
									label={t('ns_erp:fields.license_plate')}
									name='license_plate'
									placeholder='e.g., ABC-12345'
									description={t('ns_inoutbound:description.license_plate_field')}
									onChange={(e) => form.setValue('license_plate', e.currentTarget.value.toUpperCase() || null)}
								/>
							</FieldSet>
						</FieldGroup>
						{isMobile && (
							<Fragment>
								<FieldSeparator />
								<FieldGroup>
									<FieldSet>
										<FieldLegend variant='label' className='mb-1'>
											{t('ns_inoutbound:titles.container_condition_assessment')}
										</FieldLegend>
										<FieldDescription>
											{t('ns_inoutbound:description.container_condition_assessment')}
										</FieldDescription>
										<FieldGroup className='gap-3'>
											<FormField
												name='punctured_container'
												control={form.control}
												render={({ field }) => (
													<FormItem>
														<Field orientation='horizontal'>
															<FormControl>
																<Checkbox
																	checked={Boolean(field.value)}
																	onCheckedChange={field.onChange}
																/>
															</FormControl>
															<FormLabel>{t('ns_erp:fields.punctured_container')}</FormLabel>
														</Field>
													</FormItem>
												)}
											/>
											<FormField
												name='smelling_container'
												control={form.control}
												render={({ field }) => (
													<FormItem>
														<Field orientation='horizontal'>
															<FormControl>
																<Checkbox
																	checked={Boolean(field.value)}
																	onCheckedChange={field.onChange}
																/>
															</FormControl>

															<FormLabel>{t('ns_erp:fields.smelling_container')}</FormLabel>
														</Field>
													</FormItem>
												)}
											/>
											<FormField
												name='moist_container'
												control={form.control}
												render={({ field }) => (
													<FormItem>
														<Field orientation='horizontal'>
															<FormControl>
																<Checkbox
																	checked={Boolean(field.value)}
																	onCheckedChange={field.onChange}
																/>
															</FormControl>
															<FormLabel>{t('ns_erp:fields.moist_container')}</FormLabel>
														</Field>
													</FormItem>
												)}
											/>
										</FieldGroup>
									</FieldSet>
								</FieldGroup>
							</Fragment>
						)}
						<FieldGroup>
							<FieldSet>
								<TextareaFieldControl
									name='remark'
									label={t('ns_common:common_fields.remark')}
									placeholder={capitalize(
										t('ns_common:form_placeholder.fill', {
											object: t('ns_common:common_fields.remark'),
											defaultValue: null
										})
									)}
								/>
							</FieldSet>
						</FieldGroup>
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
