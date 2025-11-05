import { usePageProvider } from '@/app/admin/_layout.user-management/-contexts/page-content'
import { useUpdateUserManagement } from '@/app/admin/_layout.user-management/-hooks/use-user-management'
import { UserFormSchema, UserFormValueDTO } from '@/app/admin/_layout.user-management/-schemas/user-form-value.schema'
import { CommonActions, RecordStatus, Role } from '@/common/constants/enums'
import {
	Button,
	ComboboxFieldControl,
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	InputFieldControl
} from '@/components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useMemo } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

const UserFormDialog: React.FC = () => {
	const { t } = useTranslation()
	const { event$ } = usePageProvider()
	const { mutateAsync: updateUserFn } = useUpdateUserManagement()
	const [isOpen, setIsOpen] = React.useState<boolean>(false)

	const form = useForm<UserFormValueDTO>({
		resolver: zodResolver(UserFormSchema),
		mode: 'all',
		defaultValues: {
			keyid: undefined,
			isactive: RecordStatus.ACTIVE,
			user_code: '',
			employee_name: '',
			employee_code: '',
			user_password: '',
			role: '',
			email: '',
			sex: '',
			birthday: '' as any
		}
	})

	// subscribe to event bus
	event$.useSubscription((event) => {
		if (event.action === CommonActions.UPDATE) {
			setIsOpen(true)
			form.reset({
				...event.payload,
				role: event.payload.role || '',
				isactive: event.payload.isactive === 'Y' ? RecordStatus.ACTIVE : RecordStatus.INACTIVE,
				birthday: event.payload.birthday ? new Date(event.payload.birthday) : ('' as any)
			})
		}
	})

	const RoleOptions = useMemo(
		() =>
			Object.values(Role).map((role) => ({
				label: role ? t(`ns_common:role.${role}`) : 'Unknown',
				value: role
			})),
		[]
	)

	const ActiveOptions = useMemo(
		() =>
			Object.values(RecordStatus).map((status) => ({
				label: status === 'Y' ? t('ns_common:status.active') : t('ns_common:status.idle'),
				value: status
			})),
		[]
	)

	const SexOptions = useMemo(
		() => [
			{ label: t('ns_common:sex.male'), value: 'M' },
			{ label: t('ns_common:sex.female'), value: 'F' }
		],
		[]
	)

	const onSubmit: SubmitHandler<UserFormValueDTO> = (data) => {
		if (data.keyid) {
			updateUserFn(data)
		}
		setIsOpen(false)
	}

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<FormProvider {...form}>
				<DialogContent>
					<form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-2 p-4'>
						<DialogHeader className='pb-3'>
							<DialogTitle>{t('ns_common:actions.update')}</DialogTitle>
							<hr />
						</DialogHeader>

						<ComboboxFieldControl
							name='isactive'
							label={t('ns_common:common_fields.status')}
							datalist={ActiveOptions}
							labelField='label'
							valueField='value'
							shouldFilter
						/>

						<InputFieldControl
							name='user_code'
							label={t('ns_admin:user_management.user_code')}
							placeholder='Enter user code'
							autoComplete='off'
						/>

						<InputFieldControl
							name='employee_name'
							label={t('ns_admin:user_management.employee_name')}
							placeholder='Enter employee name'
							autoComplete='off'
						/>

						<InputFieldControl
							name='user_password'
							type='password'
							label={t('ns_admin:user_management.password')}
							placeholder='Enter password'
							autoComplete='off'
						/>

						<ComboboxFieldControl
							name='role'
							label={t('ns_admin:user_management.role')}
							datalist={RoleOptions}
							labelField='label'
							valueField='value'
							shouldFilter
						/>

						<InputFieldControl
							name='email'
							type='email'
							label={t('ns_admin:user_management.email')}
							placeholder='Enter email address'
							autoComplete='off'
						/>

						<ComboboxFieldControl
							name='sex'
							label={t('ns_admin:user_management.sex')}
							datalist={SexOptions}
							labelField='label'
							valueField='value'
							shouldFilter
						/>

						<InputFieldControl name='birthday' type='date' label={t('ns_admin:user_management.dob')} />

						<DialogFooter className='pt-4'>
							<DialogClose asChild>
								<Button variant='outline'>{t('ns_common:actions.cancel')}</Button>
							</DialogClose>
							<Button type='submit'>{t('ns_common:actions.save')}</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</FormProvider>
		</Dialog>
	)
}

export default UserFormDialog
