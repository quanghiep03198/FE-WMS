import { useUpdateUserManagement } from '@/app/admin/_layout.user-management/-hooks/use-user-management'
import { UserFormSchema, UserFormValueDTO } from '@/app/admin/_layout.user-management/-schemas/user-form-value.schema'
import { RecordStatus, Role } from '@/common/constants/enums'
import { IUserManagement } from '@/common/types/entities'
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
import React, { useEffect, useMemo } from 'react'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'

export type UserManagementModalProps = {
	row?: IUserManagement
	isOpen: boolean
	onOpenChange: (isOpen: boolean) => void
}

const UserManagementModal: React.FC<UserManagementModalProps> = ({ row, isOpen = false, onOpenChange }) => {
	const { mutateAsync: updateUserFn } = useUpdateUserManagement()

	const form = useForm<UserFormValueDTO>({
		resolver: zodResolver(UserFormSchema),
		mode: 'onSubmit',
		defaultValues: {
			keyid: row?.keyid ?? null,
			isactive: (row?.isactive as RecordStatus) ?? RecordStatus.ACTIVE,
			user_code: row?.user_code ?? '',
			employee_name: row?.employee_name ?? '',
			employee_code: row?.employee_code ?? '',
			user_password: row?.user_password ?? '',
			role: row?.role ?? '',
			email: row?.email ?? '',
			sex: row?.sex ?? '',
			birthday: row?.birthday ? new Date(row.birthday) : ('' as any)
		}
	})

	useEffect(() => {
		if (isOpen) {
			form.reset({
				keyid: row?.keyid ?? null,
				isactive: (row?.isactive as RecordStatus) ?? RecordStatus.ACTIVE,
				user_code: row?.user_code ?? '',
				employee_name: row?.employee_name ?? '',
				employee_code: row?.employee_code ?? '',
				user_password: row?.user_password ?? '',
				role: row?.role ?? '',
				email: row?.email ?? '',
				sex: row?.sex ?? '',
				birthday: row?.birthday ? new Date(row.birthday) : ('' as any)
			})
		}
	}, [isOpen, row])

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
	}

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<FormProvider {...form}>
				<DialogContent>
					<form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-2 p-4'>
						<DialogHeader className='pb-3'>
							<DialogTitle>Edit Profile</DialogTitle>
							<hr />
						</DialogHeader>

						{/* Hidden key */}
						<InputFieldControl name='keyid' type='hidden' />
						<InputFieldControl name='employee_code' type='hidden' />

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

export default UserManagementModal
