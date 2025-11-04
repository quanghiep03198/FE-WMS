import { usePageProvider } from '@/app/admin/_layout.permission-management/-contexts/page-context'
import {
	useInsertPermission,
	useUpdatePermission
} from '@/app/admin/_layout.permission-management/-hooks/use-permission-management'
import {
	permissionValidator,
	PermissionValueDTO
} from '@/app/admin/_layout.permission-management/-schemas/permission-form-value.schema'
import { CommonActions, RecordStatus, Role } from '@/common/constants/enums'
import { IPermission } from '@/common/types/entities'
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

const PermissionFormDialog: React.FC = () => {
	const { event$ } = usePageProvider()
	const [rows, setRows] = React.useState<IPermission[]>([])

	// state management for dialog
	const [isOpen, onOpenChange] = React.useState<boolean>(false)
	const [isUpdate, setIsUpdate] = React.useState<boolean>(false)

	// mutation hooks
	const { mutateAsync: insertPermissionFn } = useInsertPermission()
	const { mutateAsync: updatePermissionFn } = useUpdatePermission()

	// define form with react-hook-form
	const form = useForm<PermissionValueDTO>({
		resolver: zodResolver(permissionValidator),
		mode: 'all',
		defaultValues: {
			keyid: undefined,
			permission_name: '',
			remark: '',
			role: undefined,
			parent_id: undefined,
			is_active: 'Y'
		}
	})

	// subscribe to event bus
	event$.useSubscription((event) => {
		setRows(event.rows as IPermission[])
		if (event.action === CommonActions.CREATE) {
			onOpenChange(true)
			setIsUpdate(false)
			form.reset({
				keyid: undefined,
				permission_name: '',
				remark: '',
				role: undefined,
				parent_id: undefined,
				is_active: 'Y'
			})
		} else if (event.action === CommonActions.UPDATE) {
			onOpenChange(true)
			setIsUpdate(true)
			const row = event.payload
			form.reset({
				keyid: row.id,
				permission_name: row.permission_name,
				remark: row.remark,
				role: row.role as Role,
				parent_id: row.parent_id ? String(row.parent_id) : undefined,
				is_active: row.is_active as RecordStatus
			})
		}
	})

	// memoized role options
	const RoleOptions = useMemo(
		() =>
			Object.values(Role).map((role) => ({
				label: role,
				value: role
			})),
		[]
	)

	// memoized is_active options
	const ActiveOptions = useMemo(
		() =>
			Object.values(RecordStatus).map((status) => ({
				label: status,
				value: status
			})),
		[]
	)

	// memoized parent role options
	const ParentOptions = useMemo(() => {
		return [
			{ label: 'No Parent', value: '' },
			...Object.values(rows).map((permission) => ({
				label: permission.permission_name,
				value: String(permission.id)
			}))
		]
	}, [rows])

	// form submit handler
	const onSubmit: SubmitHandler<PermissionValueDTO> = (data) => {
		if (data.keyid) {
			updatePermissionFn({
				id: data.keyid,
				payload: data
			})
		} else {
			insertPermissionFn(data)
		}
		onOpenChange(false)
	}

	return (
		<Dialog open={isOpen} onOpenChange={onOpenChange}>
			<FormProvider {...form}>
				<DialogContent>
					<form onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-2 p-4'>
						<DialogHeader className='pb-3'>
							<DialogTitle>{isUpdate ? 'Edit Role' : 'Add Role'}</DialogTitle>
							<hr />
						</DialogHeader>

						<ComboboxFieldControl
							name='is_active'
							label='Status'
							datalist={ActiveOptions}
							labelField='label'
							valueField='value'
							shouldFilter
						/>

						<InputFieldControl
							name='permission_name'
							label='Permission Name'
							placeholder='Enter permission name'
							autoComplete='off'
						/>

						<InputFieldControl
							name='remark'
							type='remark'
							label='Remark'
							placeholder='Enter remark'
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

						<ComboboxFieldControl
							name='parent_id'
							label='Parent'
							datalist={ParentOptions}
							labelField='label'
							valueField='value'
							shouldFilter
						/>

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

export default PermissionFormDialog
