import { CommonActions, FactoryCode } from '@/common/constants/enums'
import {
	Button,
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
import React, { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { usePageContext } from '../-contexts/page-context'
import { createUserSchema, updateUserSchema } from '../-schemas/user.schema'

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
	const { event$ } = usePageContext()
	const { t } = useTranslation()
	const [dialogHelperTexts, setDialogHelperTexts] = useState({
		title: '',
		description: ''
	})
	const formSchemaRef = useRef<any>(createUserSchema)
	const form = useForm({
		resolver: zodResolver(formSchemaRef.current)
	})

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

	const factoryCodesDatalist = [
		{ value: FactoryCode.VA1, label: t('ns_common:factory.VA1') },
		{ value: FactoryCode.VB1, label: t('ns_common:factory.VB1') },
		{ value: FactoryCode.VB2, label: t('ns_common:factory.VB2') },
		{ value: FactoryCode.CA1, label: t('ns_common:factory.CA1') }
	]

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{dialogHelperTexts.title}</DialogTitle>
					<DialogDescription>{dialogHelperTexts.description}</DialogDescription>
				</DialogHeader>
				<FormProvider {...form}>
					<DialogForm
						onSubmit={form.handleSubmit((data) => {
							console.log(data)
						})}>
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
							name='email'
							label={t('ns_auth:fields.email')}
							placeholder={capitalize(
								t('ns_common:form_placeholder.fill', {
									object: t('ns_auth:fields.email'),
									defaultValue: null
								})
							)}
						/>
						<InputFieldControl
							name='employee_code'
							placeholder={capitalize(
								t('ns_common:form_placeholder.fill', {
									object: t('ns_auth:fields.employee_code'),
									defaultValue: null
								})
							)}
							label={t('ns_auth:fields.employee_code')}
						/>
						<MultiSelectFieldControl
							name='roles'
							label={t('ns_auth:fields.role')}
							placeholder={capitalize(
								t('ns_common:form_placeholder.select', { object: t('ns_auth:fields.role'), defaultValue: null })
							)}
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
							<Button>{t('ns_common:actions.confirm')}</Button>
							<DialogClose asChild>
								<Button variant='secondary'>{t('ns_common:actions.cancel')}</Button>
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
