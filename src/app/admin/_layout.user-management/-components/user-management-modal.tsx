import { UserFormSchema, UserFormValue } from '@/app/admin/_layout.user-management/-schemas/user-form-value.schema'
import { RecordStatus, Role } from '@/common/constants/enums'
import { IUserManagement } from '@/common/types/entities'
import {
	Button,
	ComboboxFieldControl,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	InputFieldControl
} from '@/components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'

export type UserManagementModalProps = {
	row?: IUserManagement
	isOpen: boolean
	onOpenChange: (isOpen: boolean) => void
}

const UserManagementModal: React.FC<UserManagementModalProps> = ({ row, isOpen = false, onOpenChange }) => {
	const form = useForm<UserFormValue>({
		resolver: zodResolver(UserFormSchema),
		mode: 'all',
		defaultValues: {
			keyid: row?.keyid ?? null,
			isactive: (row?.isactive as RecordStatus) ?? RecordStatus.ACTIVE,
			user_code: row?.user_code,
			employee_name: row?.employee_name,
			user_password: row?.user_password,
			role: row?.role,
			email: row?.email,
			sex: row?.sex,
			birthday: row?.birthday ? new Date(row?.birthday) : null
		}
	})

	useEffect(() => {
		if (row) {
			form.reset({
				keyid: row.keyid ?? null,
				isactive: (row.isactive as RecordStatus) ?? RecordStatus.ACTIVE,
				user_code: row.user_code,
				employee_name: row.employee_name,
				user_password: row.user_password,
				role: row.role,
				email: row.email,
				sex: row.sex,
				birthday: row.birthday ? new Date(row.birthday) : null
			})
		} else {
			form.reset({
				keyid: null,
				isactive: RecordStatus.ACTIVE,
				user_code: '',
				employee_name: '',
				user_password: '',
				role: '',
				email: '',
				sex: '',
				birthday: null
			})
		}
	}, [row, form])

	const RoleOptions = Object.values(Role).map((role) => ({
		label: role,
		value: role
	}))

	const ActiveOptions = Object.values(RecordStatus).map((status) => ({
		label: status,
		value: status
	}))

	const SexOptions = [
		{ label: 'Male', value: 'M' },
		{ label: 'Female', value: 'F' }
	]

	const onSubmit: SubmitHandler<UserFormValue> = (data) => {
		console.log('✅ Form data:', data)
	}

	return (
		<Dialog open={isOpen} onOpenChange={() => onOpenChange(false)}>
			<FormProvider {...form}>
				<DialogContent>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4 p-4 sm:max-w-lg'>
						<DialogHeader>
							<DialogTitle>Edit Profile</DialogTitle>
							<DialogDescription>Make changes to your profile. Click save when you're done.</DialogDescription>
						</DialogHeader>

						<InputFieldControl name='keyid' type='hidden' />

						{/* Status */}
						<ComboboxFieldControl
							name='isactive'
							label='Status'
							datalist={ActiveOptions}
							labelField='label'
							valueField='value'
							shouldFilter={true}
						/>

						{/* User code */}
						<InputFieldControl
							name='user_code'
							label='User Code'
							placeholder='Enter user code'
							autoComplete='off'
						/>

						{/* Employee name */}
						<InputFieldControl
							name='employee_name'
							label='Employee Name'
							placeholder='Enter employee name'
							autoComplete='off'
						/>

						{/* Password */}
						<InputFieldControl
							name='user_password'
							type='password'
							label='Password'
							placeholder='Enter password'
							autoComplete='off'
						/>

						{/* Role */}
						<ComboboxFieldControl
							name='role'
							label='Role'
							datalist={RoleOptions}
							labelField='label'
							valueField='value'
							shouldFilter={true}
						/>

						{/* Email */}
						<InputFieldControl
							name='email'
							type='email'
							label='Email'
							placeholder='Enter email address'
							autoComplete='off'
						/>

						{/* Gender */}
						<ComboboxFieldControl
							name='sex'
							label='Gender'
							datalist={SexOptions}
							labelField='label'
							valueField='value'
							shouldFilter={true}
						/>

						{/* Birthday */}
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

export default UserManagementModal
