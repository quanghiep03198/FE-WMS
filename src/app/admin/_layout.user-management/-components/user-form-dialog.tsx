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

const UserFormDialog: React.FC = () => {
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
				label: role,
				value: role
			})),
		[]
	)

	const ActiveOptions = useMemo(
		() =>
			Object.values(RecordStatus).map((status) => ({
				label: status,
				value: status
			})),
		[]
	)

	const SexOptions = useMemo(
		() => [
			{ label: 'Male', value: 'M' },
			{ label: 'Female', value: 'F' }
		],
		[]
	)

	const onSubmit: SubmitHandler<UserFormValueDTO> = (data) => {
		console.log('Form Submitted:', data)
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
							<DialogTitle>Edit Profile</DialogTitle>
							<hr />
						</DialogHeader>

						<ComboboxFieldControl
							name='isactive'
							label='Status'
							datalist={ActiveOptions}
							labelField='label'
							valueField='value'
							shouldFilter
						/>

						<InputFieldControl
							name='user_code'
							label='User Code'
							placeholder='Enter user code'
							autoComplete='off'
						/>

						<InputFieldControl
							name='employee_name'
							label='Employee Name'
							placeholder='Enter employee name'
							autoComplete='off'
						/>

						<InputFieldControl
							name='user_password'
							type='password'
							label='Password'
							placeholder='Enter password'
							autoComplete='off'
						/>

						<ComboboxFieldControl
							name='role'
							label='Role'
							datalist={RoleOptions}
							labelField='label'
							valueField='value'
							shouldFilter
						/>

						<InputFieldControl
							name='email'
							type='email'
							label='Email'
							placeholder='Enter email address'
							autoComplete='off'
						/>

						<ComboboxFieldControl
							name='sex'
							label='Gender'
							datalist={SexOptions}
							labelField='label'
							valueField='value'
							shouldFilter
						/>

						<InputFieldControl name='birthday' type='date' label='Birthday' />

						<DialogFooter className='pt-4'>
							<DialogClose asChild>
								<Button variant='outline'>Cancel</Button>
							</DialogClose>
							<Button type='submit'>Save changes</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</FormProvider>
		</Dialog>
	)
}

export default UserFormDialog
