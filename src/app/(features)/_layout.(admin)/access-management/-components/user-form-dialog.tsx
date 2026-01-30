import { CommonActions, FactoryCode, UserRole } from '@/common/constants/enums'
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
	Form as FormProvider,
	Icon,
	InputFieldControl,
	MultiSelectFieldControl
} from '@/components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import { capitalize } from 'lodash-es'
import React, { useMemo, useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { usePageContext } from '../-contexts/page-context'
import { useCreateUserMutation } from '../-hooks/use-user-asm'
import { CreateUserFormValues, createUserSchema, updateUserSchema } from '../-schemas/user.schema'

const UserFormDialogTrigger: React.FC = () => {
	const { event$ } = usePageContext()
	const { t, i18n } = useTranslation()

	return (
		<Button onClick={() => event$.emit({ action: CommonActions.CREATE })}>
			<Icon name='CircleFadingPlus' />
			{t('ns_common:actions.add')}
		</Button>
	)
}

const UserFormDialog: React.FC = () => {
	const [open, setOpen] = useState<boolean>(false)
	const { event$ } = usePageContext()
	const { t, i18n } = useTranslation()
	const [dialogHelperTexts, setDialogHelperTexts] = useState({
		title: '',
		description: ''
	})
	const formSchemaRef = useRef<any>(createUserSchema)
	const form = useForm({
		resolver: zodResolver(formSchemaRef.current)
	})

	const { mutateAsync, isPending, isError } = useCreateUserMutation()

	event$.useSubscription(({ action, payload }) => {
		setOpen(true)
		if (action === CommonActions.UPDATE) {
			formSchemaRef.current = updateUserSchema
			setDialogHelperTexts({
				title: t('ns_auth:titles.create_user'),
				description: t('ns_auth:descriptions.update_user')
			})
			form.reset(payload)
		} else {
			formSchemaRef.current = createUserSchema
			setDialogHelperTexts({
				title: t('ns_auth:titles.create_user'),
				description: t('ns_auth:descriptions.create_user')
			})
			form.reset()
		}
	})

	const factoryCodesDatalist = useMemo(
		() => [
			{ value: FactoryCode.VA1, label: t('ns_common:factory.VA1') },
			{ value: FactoryCode.VB1, label: t('ns_common:factory.VB1') },
			{ value: FactoryCode.VB2, label: t('ns_common:factory.VB2') },
			{ value: FactoryCode.CA1, label: t('ns_common:factory.CA1') }
		],
		[i18n.language]
	)

	const selectedRoles = useWatch({ name: 'roles', control: form.control })

	const rolesDatalist = useMemo(() => {
		const roles = [
			{ value: UserRole.ADMIN, label: t('ns_auth:roles.ADMIN'), allowMultiple: false },
			{ value: UserRole.MANAGER, label: t('ns_auth:roles.MANAGER'), allowMultiple: false },
			{ value: UserRole.FG_WAREHOUSE_STAFF, label: t('ns_auth:roles.FG_WAREHOUSE_STAFF'), allowMultiple: true },
			{ value: UserRole.DG_WAREHOUSE_STAFF, label: t('ns_auth:roles.DG_WAREHOUSE_STAFF'), allowMultiple: true },
			{ value: UserRole.IE_STAFF, label: t('ns_auth:roles.IE_STAFF'), allowMultiple: false },
			{ value: UserRole.SECURITY_GUARD, label: t('ns_auth:roles.SECURITY_GUARD'), allowMultiple: false }
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

	const handleCreateUser = (data: CreateUserFormValues) => {
		toast.promise(mutateAsync({ ...data, password: data.username }), {
			loading: t('ns_common:notification.processing_request'),
			success: () => {
				setOpen(false)
				return t('ns_common:notification.success')
			},
			error: t('ns_common:notification.error')
		})
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{dialogHelperTexts.title}</DialogTitle>
					<DialogDescription>{dialogHelperTexts.description}</DialogDescription>
				</DialogHeader>
				<FormProvider {...form}>
					<DialogForm onSubmit={form.handleSubmit(handleCreateUser)}>
						<InputFieldControl
							name='username'
							label={t('ns_auth:fields.username')}
							placeholder={capitalize(
								t('ns_common:form_placeholder.fill', {
									object: t('ns_auth:fields.username'),
									defaultValue: null
								})
							)}
						/>
						<InputFieldControl
							name='display_name'
							label={t('ns_auth:fields.display_name')}
							onChange={(e) => form.setValue('display_name', e.target.value.toUpperCase())}
							placeholder={capitalize(
								t('ns_common:form_placeholder.fill', {
									object: t('ns_auth:fields.display_name'),
									defaultValue: null
								})
							)}
						/>
						<InputFieldControl
							name='email'
							label={t('ns_auth:fields.email')}
							placeholder={'example@vn.well-union.com'}
						/>
						<InputFieldControl
							name='employee_code'
							label={t('ns_auth:fields.employee_code')}
							placeholder='e.g., S000001'
							onChange={(e) => form.setValue('employee_code', e.target.value.toUpperCase())}
						/>
						<MultiSelectFieldControl
							name='roles'
							label={t('ns_auth:fields.role')}
							placeholder={capitalize(
								t('ns_common:form_placeholder.select', { object: t('ns_auth:fields.role'), defaultValue: null })
							)}
							canSelectAll={false}
							datalist={rolesDatalist}
							labelField='label'
							valueField='value'
						/>
						<MultiSelectFieldControl
							name='authorized_factory_codes'
							label={t('ns_company:factory')}
							placeholder={capitalize(
								t('ns_common:form_placeholder.select', { object: t('ns_company:factory'), defaultValue: null })
							)}
							datalist={factoryCodesDatalist}
							labelField='label'
							maxCount={3}
							valueField='value'
						/>
						<DialogFooter>
							<Button type='submit' disabled={isPending}>
								<Icon name={isPending ? 'LoaderCircle' : 'Check'} className={isPending && 'animate-spin'} />
								{isError ? t('ns_common:actions.retry') : t('ns_common:actions.save')}
							</Button>
							<DialogClose className={buttonVariants({ variant: 'secondary' })} onClick={() => form.reset({})}>
								<Icon name='X' />
								{t('ns_common:actions.cancel')}
							</DialogClose>
						</DialogFooter>
					</DialogForm>
				</FormProvider>
			</DialogContent>
		</Dialog>
	)
}

const DialogForm: React.FC<React.FormHTMLAttributes<HTMLFormElement>> = tw.form`grid gap-6`

export { UserFormDialog, UserFormDialogTrigger }
