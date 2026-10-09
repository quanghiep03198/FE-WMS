import { CommonActions, UserRole } from '@common/constants/enums'
import { cn } from '@common/utils/cn'
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
	Div,
	Form as FormProvider,
	Icon,
	InputFieldControl,
	MultiSelectFieldControl
} from '@components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { capitalize } from 'lodash-es'
import React, { useMemo, useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import type z from 'zod'
import { usePageContext } from '../contexts'
import { useCreateUserMutation, useUpdateUserMutation } from '../hooks/use-user-request'
import type { CreateUserFormValues, UpdateUserFormValues} from '../schemas/user.schema';
import { createUserSchema, updateUserSchema } from '../schemas/user.schema'

const UserFormDialogTrigger: React.FC = () => {
	const { event$ } = usePageContext()
	const { t } = useTranslation()

	return (
		<Button onClick={() => event$.emit({ action: CommonActions.CREATE })}>
			<Icon name='CircleFadingPlus' />
			{t('ns_common:actions.add')}
		</Button>
	)
}

const UserFormDialog: React.FC = () => {
	const [open, setOpen] = useState<boolean>(false)
	const [action, setAction] = useState<CommonActions.CREATE | CommonActions.UPDATE | null>(null)
	const { event$ } = usePageContext()
	const { t, i18n } = useTranslation()
	const [dialogHelperTexts, setDialogHelperTexts] = useState({
		title: '',
		description: ''
	})
	const formSchemaRef = useRef<typeof createUserSchema | typeof updateUserSchema>(createUserSchema)

	const form = useForm<z.infer<typeof formSchemaRef.current>>({
		resolver: zodResolver(formSchemaRef.current),
		context: { action: null }
	})

	const {
		mutateAsync: createAsync,
		isPending: isUpdateProcessing,
		isError: isFailedToCreate
	} = useCreateUserMutation()
	const {
		mutateAsync: updateAsync,
		isPending: isCreationProcessing,
		isError: isFailedToUpdate
	} = useUpdateUserMutation()

	const formActionRef = useRef<typeof createAsync | typeof updateAsync | null>(null)

	const isPending = isCreationProcessing || isUpdateProcessing
	const isError = isFailedToCreate || isFailedToUpdate

	event$.useSubscription(({ action, payload }) => {
		if (action !== CommonActions.CREATE && action !== CommonActions.UPDATE) return
		setAction(action)
		setOpen(true)
		if (action === CommonActions.UPDATE) {
			formSchemaRef.current = updateUserSchema
			formActionRef.current = updateAsync
			setDialogHelperTexts({
				title: t('ns_auth:titles.update_user'),
				description: t('ns_auth:descriptions.update_user')
			})
			form.reset(payload)
		} else {
			formSchemaRef.current = createUserSchema
			formActionRef.current = createAsync
			setDialogHelperTexts({
				title: t('ns_auth:titles.create_user'),
				description: t('ns_auth:descriptions.create_user')
			})
			form.reset()
		}
	})

	const selectedRoles = useWatch({ name: 'roles', control: form.control })

	const rolesDatalist = useMemo(() => {
		const roles = [
			{
				value: UserRole.ADMIN,
				label: t('ns_auth:roles.ADMIN'),
				allowMultiple: false
			},
			{
				value: UserRole.MANAGER,
				label: t('ns_auth:roles.MANAGER'),
				allowMultiple: false
			},
			{
				value: UserRole.FG_WAREHOUSE_STAFF,
				label: t('ns_auth:roles.FG_WAREHOUSE_STAFF'),
				allowMultiple: true
			},
			{
				value: UserRole.DG_WAREHOUSE_STAFF,
				label: t('ns_auth:roles.DG_WAREHOUSE_STAFF'),
				allowMultiple: true
			},
			{
				value: UserRole.IE_STAFF,
				label: t('ns_auth:roles.IE_STAFF'),
				allowMultiple: true
			},
			{
				value: UserRole.INDUSTRIAL_ENGINEERING_STAFF,
				label: t('ns_auth:roles.INDUSTRIAL_ENGINEERING_STAFF'),
				allowMultiple: false
			},
			{
				value: UserRole.SECURITY_GUARD,
				label: t('ns_auth:roles.SECURITY_GUARD'),
				allowMultiple: false
			}
		]
		if (!Array.isArray(selectedRoles) || selectedRoles.length === 0) return roles
		if (roles.some((role) => selectedRoles.includes(role.value) && !role.allowMultiple))
			return roles.map((role) => ({
				...role,
				disabled: !selectedRoles.includes(role.value)
			}))

		return roles.map((role) => {
			return { ...role, disabled: !role.allowMultiple }
		})
	}, [i18n.language, selectedRoles])

	const handleSave = async (data: z.infer<typeof formSchemaRef.current> & { _id?: string }) => {
		if (typeof formActionRef.current !== 'function') return
		const payload = { ...data, password: data.password ?? data.username } as CreateUserFormValues &
			UpdateUserFormValues
		for (const key in payload) {
			if (payload[key] === '') payload[key] = null
		}
		if (action === CommonActions.UPDATE) delete payload.password
		await formActionRef.current(payload)
	}

	return (
		<Dialog
			open={open}
			onOpenChange={(open) => {
				setOpen(open)
				if (!open) {
					form.reset()
					setAction(null)
				}
			}}>
			<DialogContent className='max-w-xl'>
				<DialogHeader>
					<DialogTitle>{dialogHelperTexts.title}</DialogTitle>
					<DialogDescription>{dialogHelperTexts.description}</DialogDescription>
				</DialogHeader>
				<FormProvider {...form}>
					<DialogForm onSubmit={form.handleSubmit(async (data) => await handleSave(data))}>
						<Div className={cn(action === CommonActions.CREATE ? 'col-span-1' : 'col-span-full')}>
							<InputFieldControl
								label={t('ns_auth:fields.username')}
								name='username'
								placeholder={capitalize(
									t('ns_common:form_placeholder.fill', {
										object: t('ns_auth:fields.username'),
										defaultValue: null
									})
								)}
							/>
						</Div>
						{action === CommonActions.CREATE && (
							<InputFieldControl
								label={t('ns_auth:fields.password')}
								name='password'
								placeholder={'******'}
								type='password'
							/>
						)}
						<Div className='col-span-full'>
							<InputFieldControl
								label={t('ns_auth:fields.display_name')}
								name='display_name'
								placeholder={capitalize(
									t('ns_common:form_placeholder.fill', {
										object: t('ns_auth:fields.display_name'),
										defaultValue: null
									})
								)}
								onChange={(e) => form.setValue('display_name', e.target.value.toUpperCase())}
							/>
						</Div>

						<Div className='col-span-full'>
							<InputFieldControl
								label={t('ns_auth:fields.email')}
								name='email'
								placeholder={'example@vn.well-union.com'}
								type='email'
							/>
						</Div>
						<Div className='col-span-full *:aria-[roledescription=selected-item]:max-w-32!'>
							<MultiSelectFieldControl
								canSelectAll={false}
								classNames={{ selectedItem: '*:first:max-w-40' }}
								datalist={rolesDatalist}
								label={t('ns_auth:fields.role')}
								labelField='label'
								name='roles'
								valueField='value'
								placeholder={capitalize(
									t('ns_common:form_placeholder.select', {
										object: t('ns_auth:fields.role'),
										defaultValue: null
									})
								)}
							/>
						</Div>
						{/* <Div className='col-span-full'>
							<MultiSelectFieldControl
								name='authorized_factory_codes'
								label={t('ns_company:factory')}
								placeholder={capitalize(
									t('ns_common:form_placeholder.select', {
										object: t('ns_company:factory'),
										defaultValue: null
									})
								)}
								classNames={{ selectedItem: '*:first:max-w-24' }}
								datalist={factoryCodesDatalist}
								labelField='label'
								maxCount={3}
								valueField='value'
							/>
						</Div> */}
						<DialogFooter className='col-span-full'>
							<Button disabled={isPending} type='submit'>
								{isPending && <Icon className='animate-spin' name='LoaderCircle' />}
								{isError ? t('ns_common:actions.retry') : t('ns_common:actions.submit')}
							</Button>
							<DialogClose className={buttonVariants({ variant: 'secondary' })} onClick={() => form.reset({})}>
								{t('ns_common:actions.cancel')}
							</DialogClose>
						</DialogFooter>
					</DialogForm>
				</FormProvider>
			</DialogContent>
		</Dialog>
	)
}

const DialogForm: React.FC<React.FormHTMLAttributes<HTMLFormElement>> = tw.form`grid gap-y-6 gap-x-2 grid-cols-2`

export { UserFormDialog, UserFormDialogTrigger }
