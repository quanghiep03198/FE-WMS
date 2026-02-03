import { useUpdatePasswordMutation } from '@/app/-hooks/use-user-asm'
import { Button, Div, Form as FormProvider, Icon, InputFieldControl, Typography } from '@/components/ui'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { type UpdatePasswordFormValues, updatePasswordFormValues } from '../-schemas/update-password.schema'

const ChangePasswordForm: React.FC = () => {
	const { mutateAsync, isPending, isError } = useUpdatePasswordMutation()
	const { t } = useTranslation()

	const form = useForm<UpdatePasswordFormValues>({
		mode: 'onChange',
		reValidateMode: 'onChange',
		resolver: zodResolver(updatePasswordFormValues),
		defaultValues: {
			currentPassword: '',
			password: ''
		}
	})

	return (
		<FormProvider {...form}>
			<Form
				onSubmit={form.handleSubmit((data) =>
					mutateAsync(data)
						.then(() => form.reset())
						.catch()
				)}>
				{/* Public profile */}
				<Fieldset>
					<Legend>{t('ns_auth:profile.update_password')}</Legend>
					<Typography variant='small' color='muted'>
						{t('ns_auth:profile.change_password_to_access')}
					</Typography>

					<Div className='space-y-6'>
						<InputFieldControl
							label={t('ns_auth:profile.current_password')}
							name='currentPassword'
							placeholder='********'
							type='password'
						/>
						<InputFieldControl
							label={t('ns_auth:profile.new_password')}
							name='password'
							placeholder='********'
							type='password'
						/>
						<Button disabled={isPending}>
							{isPending && <Icon name='LoaderCircle' className='animate-spin' />}{' '}
							{isError ? t('ns_common:actions.retry') : t('ns_auth:profile.change_password')}
						</Button>
					</Div>
				</Fieldset>
			</Form>
		</FormProvider>
	)
}

const Form = tw.form`max-w-1/2 sm:max-w-full w-full sm:mx-auto`
const Fieldset = tw.fieldset`flex flex-col items-stretch gap-y-6`
const Legend = tw.legend`text-lg font-semibold`

export default ChangePasswordForm
