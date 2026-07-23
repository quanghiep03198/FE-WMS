import { CommonActions, UserRole } from '@common/constants/enums'
import { cn } from '@common/utils/cn'
import RoleBaseAccessControl, { ACTION_RESTRICTED_TOAST_ID } from '@components/guards/role-base-access-control'
import {
	Button,
	buttonVariants,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Div,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Form as FormProvider,
	Icon,
	InputFieldControl,
	RadioGroup,
	RadioGroupItem,
	SelectFieldControl,
	Separator
} from '@components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import useAuth from '@hooks/use-auth'
import { useResetState } from 'ahooks'
import { capitalize, isNil } from 'lodash-es'
import React, { memo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { usePageContext } from '../contexts/page-context'
import { useCreateRFIDDeviceMutation, useUpdateRFIDDeviceMutation } from '../hooks/use-rfid-device-request'
import {
	type CreateRFIDReaderFormValues,
	createRFIDReaderSchema,
	type UpdateRFIDReaderFormValues,
	updateRFIDReaderSchema
} from '../schemas/rfid-device.schema'

const RFIDDeviceFormDialog: React.FC = () => {
	const [open, setOpen] = useState<boolean>(false)
	const [action, setAction, resetAction] = useResetState<CommonActions.CREATE | CommonActions.UPDATE>(null)
	const { event$ } = usePageContext()
	const { t } = useTranslation()
	const { user } = useAuth()

	const form = useForm<CreateRFIDReaderFormValues | UpdateRFIDReaderFormValues>({
		resolver: zodResolver(action === CommonActions.UPDATE ? updateRFIDReaderSchema : createRFIDReaderSchema)
	})

	event$.useSubscription(({ action, defaultValues }) => {
		setOpen((prev) => !prev)
		setAction(action)
		if (action === CommonActions.UPDATE && defaultValues) {
			form.reset(defaultValues)
		}
	})

	const { mutateAsync: createAsync, isPending: isCreating, isError: isFailedToCreate } = useCreateRFIDDeviceMutation()
	const { mutateAsync: updateAsync, isPending: isUpdating, isError: isFailedToUpdate } = useUpdateRFIDDeviceMutation()

	const isPending = isCreating || isUpdating
	const isError = isFailedToCreate || isFailedToUpdate

	const handleSubmitForm = async (data) => {
		if (isNil(action)) return
		const id = toast.loading(t('ns_common:notification.processing_request'))
		try {
			if (action === CommonActions.CREATE) createAsync(data)
			else if (action === CommonActions.UPDATE) updateAsync(data)
			toast.success(t('ns_common:notification.success'), { id })
			setOpen(false)
		} catch {
			toast.error(t('ns_common:notification.error'), { id })
		}
	}

	return (
		<RoleBaseAccessControl
			mode='fallback'
			authorizedRoles={[UserRole.ADMIN, UserRole.MANAGER]}
			fallbackComponent={
				<Button
					onClick={() =>
						toast.warning(t('ns_common:errors.403_notification'), { id: ACTION_RESTRICTED_TOAST_ID })
					}>
					<Icon name='Lock' />
					{t('ns_common:actions.add')}
				</Button>
			}>
			<Dialog defaultOpen={false} open={open || isPending || isError} onOpenChange={setOpen}>
				<DialogTrigger
					className={cn(buttonVariants({ variant: 'default' }))}
					onClick={() => {
						setAction(CommonActions.CREATE)
						form.reset()
					}}>
					<Icon name='CircleFadingPlus' />
					{t('ns_common:actions.add')}
				</DialogTrigger>
				<DialogContent className='max-w-2xl'>
					<DialogHeader>
						<DialogTitle>
							{action === CommonActions.UPDATE
								? t('ns_rfid:titles.edit_device')
								: t('ns_rfid:titles.add_device')}
						</DialogTitle>
						<DialogDescription>{t('ns_rfid:descriptions.dialog_form')}</DialogDescription>
					</DialogHeader>

					<FormProvider {...form}>
						<Form onSubmit={form.handleSubmit(handleSubmitForm)}>
							<Fieldset>
								<Div className='col-span-2'>
									<InputFieldControl
										name='device_name_vi'
										label={t('ns_common:languages.vi')}
										disabled={!user.roles.includes(UserRole.ADMIN)}
										placeholder='Tên hiển thị'
									/>
								</Div>
								<Div className='col-span-2'>
									<InputFieldControl
										name='device_name_en'
										label={t('ns_common:languages.en')}
										disabled={!user.roles.includes(UserRole.ADMIN)}
										placeholder='Display name'
									/>
								</Div>
								<Div className='col-span-2'>
									<InputFieldControl
										name='device_name_cn'
										label={t('ns_common:languages.cn')}
										disabled={!user.roles.includes(UserRole.ADMIN)}
										placeholder='显示名称'
									/>
								</Div>
								<Div className='col-span-full'>
									<InputFieldControl
										name='device_sn'
										label={t('ns_rfid:fields.device_sn')}
										disabled={!user.roles.includes(UserRole.ADMIN)}
										placeholder='xxx xxx xxx'
										description={t('ns_rfid:descriptions.device_sn')}
									/>
								</Div>
								<Div className='col-span-3'>
									<InputFieldControl name='ip_address' label='TCP/IP' placeholder='192.xxx.xxx.xxx' />
								</Div>
								<Div className='col-span-3'>
									<InputFieldControl name='ip_port' label='TCP/IP port' placeholder='8160' />
								</Div>
								<Div className='col-span-full'>
									<SelectFieldControl
										name='station_no'
										label={t('ns_rfid:fields.station_no')}
										placeholder={capitalize(
											t('ns_common:form_placeholder.select', {
												object: t('ns_rfid:fields.station_no'),
												defaultValue: 'Select station'
											})
										)}
										datalist={[
											{ label: 'WH101', value: `CUS_${user?.current_factory_code}_WH101` },
											{ label: 'WH102', value: `CUS_${user?.current_factory_code}_WH102` },
											{ label: 'WH103', value: `CUS_${user?.current_factory_code}_WH103` }
										]}
										labelField='label'
										valueField='value'
										description={t('ns_rfid:descriptions.device_name')}
									/>
								</Div>
								<Div className='col-span-full space-y-4'>
									<FormField
										control={form.control}
										name='device_ant'
										render={({ field }) => (
											<FormItem className='space-y-3'>
												<FormLabel>{t('ns_rfid:fields.device_type')}</FormLabel>
												<FormControl>
													<RadioGroup
														value={field.value}
														onValueChange={field.onChange}
														className='flex items-center gap-x-6'>
														<FormItem className='flex items-center gap-3 space-y-0'>
															<FormControl>
																<RadioGroupItem value='1' />
															</FormControl>
															<FormLabel>Atenna</FormLabel>
														</FormItem>
														<FormItem className='flex items-center gap-3 space-y-0'>
															<FormControl>
																<RadioGroupItem value='0' />
															</FormControl>
															<FormLabel>Handhold</FormLabel>
														</FormItem>
													</RadioGroup>
												</FormControl>
												<FormMessage />
												<FormDescription>{t('ns_rfid:descriptions.device_type')}</FormDescription>
											</FormItem>
										)}
									/>
								</Div>
							</Fieldset>
							<Separator className='col-span-full' />
							<Div className='col-span-full flex items-center justify-end gap-x-1 self-end'>
								<Button type='submit' disabled={isPending}>
									<Icon name={isError ? 'RotateCw' : 'Check'} />{' '}
									{isError ? t('ns_common:actions.retry') : t('ns_common:actions.save')}
								</Button>
								<DialogClose asChild>
									<Button
										variant='outline'
										disabled={isPending}
										onClick={() => {
											form.reset()
											resetAction()
										}}>
										<Icon name='X' /> {t('ns_common:actions.cancel')}
									</Button>
								</DialogClose>
							</Div>
						</Form>
					</FormProvider>
				</DialogContent>
			</Dialog>
		</RoleBaseAccessControl>
	)
}

const Form = tw.form`space-y-6`
const Fieldset = tw.fieldset`grid grid-cols-6 gap-x-2 gap-y-6 sm:grid-cols-1`

export default memo(RFIDDeviceFormDialog)
