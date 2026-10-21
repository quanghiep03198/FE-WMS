import { CommonActions, UserRole } from '@common/constants/enums'
import { cn } from '@common/utils/cn'
import env from '@common/utils/env'
import { Div } from '@components/customs/div'
import { InputFieldControl } from '@components/forms/input'
import { SelectFieldControl } from '@components/forms/select'
import RoleBaseAccessControl, { ACTION_RESTRICTED_TOAST_ID } from '@components/guards/role-base-access-control'
import { Button, buttonVariants } from '@components/ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from '@components/ui/dialog'
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Form as FormProvider
} from '@components/ui/form'
import { Icon } from '@components/ui/icon'
import { RadioGroup, RadioGroupItem } from '@components/ui/radio-group'
import { Separator } from '@components/ui/separator'
import { zodResolver } from '@hookform/resolvers/zod'
import useAuth from '@hooks/use-auth'
import { useResetState } from 'ahooks'
import { capitalize, isNil } from 'lodash-es'
import React, { memo, useRef, useState } from 'react'
import { Resolver, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { RFIDDeviceType } from '../constants'
import { usePageContext } from '../contexts/page-context'
import { useCreateRFIDDeviceMutation, useUpdateRFIDDeviceMutation } from '../hooks/use-rfid-device-request'
import { createRFIDReaderSchema, RFIDReaderFormValues, updateRFIDReaderSchema } from '../schemas/rfid-device.schema'

const RFIDDeviceFormDialog: React.FC = () => {
	const [open, setOpen] = useState<boolean>(false)
	const [action, setAction, resetAction] = useResetState<CommonActions.CREATE | CommonActions.UPDATE | null>(null)
	const { event$ } = usePageContext()
	const { t } = useTranslation()
	const { user } = useAuth()
	const schemaRef = useRef<typeof createRFIDReaderSchema | typeof updateRFIDReaderSchema>(createRFIDReaderSchema)

	const form = useForm({
		resolver: zodResolver(schemaRef.current) as unknown as Resolver<RFIDReaderFormValues>
	})

	event$.useSubscription(({ action, payload: defaultValues }) => {
		setOpen((prev) => !prev)
		setAction(action)

		if (action === CommonActions.UPDATE && defaultValues) {
			schemaRef.current = updateRFIDReaderSchema
			form.reset(defaultValues)
		} else {
			schemaRef.current = createRFIDReaderSchema
		}
	})

	const {
		mutateAsync: createAsync,
		isPending: isCreating,
		isError: isFailedToCreate,
		reset: resetCreateError
	} = useCreateRFIDDeviceMutation()
	const {
		mutateAsync: updateAsync,
		isPending: isUpdating,
		isError: isFailedToUpdate,
		reset: resetUpdateError
	} = useUpdateRFIDDeviceMutation()

	const isPending = isCreating || isUpdating
	const isError = isFailedToCreate || isFailedToUpdate
	const resetError = () => {
		resetCreateError()
		resetUpdateError()
	}

	const handleSubmitForm = async (data) => {
		console.log('data', data)

		if (isNil(action)) return
		if (action === CommonActions.CREATE) createAsync(data)
		else if (action === CommonActions.UPDATE) updateAsync(data)
		setOpen(false)
	}

	return (
		<RoleBaseAccessControl
			authorizedRoles={[UserRole.ADMIN, UserRole.MANAGER]}
			mode='fallback'
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
										disabled={!user?.roles?.includes(UserRole.ADMIN)}
										label={t('ns_common:languages.vi')}
										name='device_name.vi'
										placeholder='Tên hiển thị'
									/>
								</Div>
								<Div className='col-span-2'>
									<InputFieldControl
										disabled={!user?.roles?.includes(UserRole.ADMIN)}
										label={t('ns_common:languages.en')}
										name='device_name.en'
										placeholder='Display name'
									/>
								</Div>
								<Div className='col-span-2'>
									<InputFieldControl
										disabled={!user?.roles?.includes(UserRole.ADMIN)}
										label={t('ns_common:languages.cn')}
										name='device_name.cn'
										placeholder='显示名称'
									/>
								</Div>
								<Div className='col-span-full'>
									<InputFieldControl
										description={t('ns_rfid:descriptions.device_sn')}
										disabled={!user?.roles?.includes(UserRole.ADMIN)}
										label={t('ns_rfid:fields.device_sn')}
										name='device_sn'
										placeholder='xxx xxx xxx'
									/>
								</Div>
								<Div className='col-span-3'>
									<InputFieldControl label='TCP/IP' name='tcp_ip' placeholder='192.xxx.xxx.xxx' />
								</Div>
								<Div className='col-span-3'>
									<InputFieldControl label='TCP/IP port' name='tcp_port' placeholder='8160' />
								</Div>
								<Div className='col-span-full'>
									<SelectFieldControl
										description={t('ns_rfid:descriptions.device_name')}
										label={t('ns_rfid:fields.station_no')}
										labelField='label'
										name='station_no'
										valueField='value'
										datalist={[
											{ label: 'WH101', value: `CUS_${env<FactoryCode>('VITE_APP_TENANT')}_WH101` },
											{ label: 'WH102', value: `CUS_${env<FactoryCode>('VITE_APP_TENANT')}_WH102` },
											{ label: 'WH103', value: `CUS_${env<FactoryCode>('VITE_APP_TENANT')}_WH103` }
										]}
										placeholder={capitalize(
											t('ns_common:form_placeholder.select', {
												object: t('ns_rfid:fields.station_no'),
												defaultValue: 'Select station'
											})
										)}
									/>
								</Div>
								<Div className='col-span-full space-y-4'>
									<FormField
										control={form.control}
										name='device_type'
										render={({ field }) => (
											<FormItem className='flex flex-col gap-y-1.5'>
												<FormLabel>{t('ns_rfid:fields.device_type')}</FormLabel>
												<FormControl>
													<RadioGroup
														className='flex items-center gap-x-6'
														value={field.value}
														onValueChange={field.onChange}>
														<FormItem className='flex items-center gap-3 space-y-0'>
															<FormControl>
																<RadioGroupItem value={RFIDDeviceType.ANTENNA} />
															</FormControl>
															<FormLabel>Atenna</FormLabel>
														</FormItem>
														<FormItem className='flex items-center gap-3 space-y-0'>
															<FormControl>
																<RadioGroupItem value={RFIDDeviceType.HANDHOLD} />
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
								<Button disabled={isPending} type='submit'>
									<Icon name={isError ? 'RotateCw' : 'Check'} />{' '}
									{isError ? t('ns_common:actions.retry') : t('ns_common:actions.save')}
								</Button>
								<DialogClose asChild>
									<Button
										disabled={isPending}
										variant='outline'
										onClick={() => {
											form.reset()
											resetError()
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
