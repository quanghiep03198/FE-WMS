import { CommonActions } from '@/common/constants/enums'
import useMediaQuery from '@/common/hooks/use-media-query'
import {
	Button,
	buttonVariants,
	Checkbox,
	DatePickerFieldControl,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	Div,
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
	Label,
	Popover,
	PopoverContent,
	PopoverTrigger,
	ScrollArea,
	Separator,
	TextareaFieldControl
} from '@/components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { capitalize, padStart } from 'lodash-es'
import { Fragment, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { usePageContext } from '../-contexts/page-context'
import { useUpdateDispatchOrderMutation } from '../-hooks/use-truckload-delivery-asm'
import type { UpdateDispatchOrderFormValues } from '../-schemas'
import { updateDispatchOrderSchema } from '../-schemas'

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
		form.reset({
			...payload,
			factory_entrance_time: payload.factory_entrance_time
				? {
						date: new Date(payload.factory_entrance_time),
						time: format(new Date(payload.factory_entrance_time), 'HH:mm')
					}
				: null
		})
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
			<DialogContent className='max-h-[85vh] max-w-lg overflow-auto scrollbar-none'>
				<DialogHeader>
					<DialogTitle>{t('ns_inoutbound:titles.update_truckload_delivery')}</DialogTitle>
					<DialogDescription>{t('ns_inoutbound:description.update_truckload_delivery')}</DialogDescription>
				</DialogHeader>
				<FormProvider {...form}>
					<Form onSubmit={form.handleSubmit(handleSaveChanges)}>
						<FieldGroup>
							<FieldSet>
								<FieldGroup
									aria-orientation='horizontal'
									className='aria-[orientation=horizontal]:grid aria-[orientation=horizontal]:grid-cols-2 aria-[orientation=horizontal]:gap-y-3'>
									<Label htmlFor='factory_entrance_time.date' className='col-span-full'>
										{t('ns_erp:fields.factory_entrance_time')}
									</Label>
									<DatePickerFieldControl name='factory_entrance_time.date' />
									<FormField
										name='factory_entrance_time.time'
										control={form.control}
										// defaultValue={form.getValues('factory_entrance_time.time') ?? format(new Date(), 'HH:mm')}
										render={({ field }) => {
											return (
												<Popover modal>
													<PopoverTrigger asChild>
														<Button
															variant='outline'
															className='justify-between font-normal hover:bg-background'>
															{field.value ?? '--:--'}
															<Icon name='Clock' />
														</Button>
													</PopoverTrigger>
													<PopoverContent className='flex w-[var(--radix-popover-trigger-width)] flex-row items-stretch'>
														{/* <Div className=></Div> */}
														<ScrollArea className='relative grid h-56 flex-1 items-stretch px-3'>
															<Div className='sticky top-0 z-10 mb-2 flex w-full items-center justify-center border-b bg-table-head py-2 text-sm font-medium uppercase text-table-head-foreground'>
																HH
															</Div>
															{Array.from({ length: 24 }, (_, hour) => {
																const value = padStart(hour.toString(), 2, '0')
																return (
																	<Button
																		key={value}
																		type='button'
																		variant='ghost'
																		className='w-full font-normal'
																		onClick={() => {
																			const fieldValue = field.value || '00:00'
																			const [, minute] = fieldValue.split(':')
																			form.setValue(
																				'factory_entrance_time.time',
																				[value, minute].join(':')
																			)
																		}}>
																		{value}
																	</Button>
																)
															})}
														</ScrollArea>
														<Separator
															orientation='vertical'
															className='h-full max-h-full min-h-56 w-px'
														/>
														<ScrollArea className='relative grid h-56 flex-1 items-stretch px-3'>
															<Div className='sticky top-0 z-10 mb-2 flex w-full items-center justify-center border-b bg-table-head py-2 text-sm font-medium uppercase text-table-head-foreground'>
																MM
															</Div>
															{Array.from({ length: 60 }, (_, minute) => {
																const value = padStart(minute.toString(), 2, '0')
																return (
																	<Button
																		key={value}
																		type='button'
																		variant='ghost'
																		className='w-full font-normal'
																		onClick={() => {
																			const fieldValue = field.value || '00:00'
																			const [hour] = fieldValue.split(':')
																			form.setValue(
																				'factory_entrance_time.time',
																				[hour, value].join(':')
																			)
																		}}>
																		{value}
																	</Button>
																)
															})}
														</ScrollArea>
													</PopoverContent>
												</Popover>
											)
										}}
									/>

									{/* <InputFieldControl
										name='factory_entrance_time.time'
										step='60'
										type='time'
										className='appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none'
									/> */}
								</FieldGroup>
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
									label={t('ns_erp:fields.seal_number')}
									name='seal_number'
									placeholder='e.g., 7355608'
									description={t('ns_inoutbound:description.seal_number_field')}
									onChange={(e) => form.setValue('seal_number', e.currentTarget.value.toUpperCase() || null)}
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
