import { useAuth } from '@/common/hooks/use-auth'
import { Button, Div, Form as FormProvider, InputFieldControl, Typography } from '@/components/ui'
import bcrypt from 'bcryptjs-react'
import { debounce } from 'lodash'
import React, { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { updatePasswordUser } from '../_apis/account.api'

const ChangePasswordForm: React.FC = () => {
	const { mutateAsync: updatePasswordFn } = updatePasswordUser()
	const { user } = useAuth()
	const { t } = useTranslation()

	const form = useForm<any>({
		mode: 'onChange',
		defaultValues: {
			currentPassword: '',
			password: ''
		}
	})

	const { control, setError, clearErrors } = form

	const currentPassword = useWatch({ control, name: 'currentPassword' })

	const validateCurrentPassword = debounce((value: string) => {
		if (!bcrypt.compareSync(value, user.password)) {
			setError('currentPassword', {
				type: 'manual',
				message: t('ns_auth:validation.password_incorrect')
			})
		} else {
			clearErrors('currentPassword')
		}
	}, 200)

	useEffect(() => {
		if (currentPassword) {
			validateCurrentPassword(currentPassword)
		}
		return () => validateCurrentPassword.cancel()
	}, [currentPassword])

	const updatePassword = (data: any) => {
		if (data.currentPassword.length < 6) {
			setError('currentPassword', {
				type: 'manual',
				message: t('ns_auth:validation.password_length')
			})
		} else if (data.password.length < 6) {
			setError('password', {
				type: 'manual',
				message: t('ns_auth:validation.password_length')
			})
			return
		} else {
			updatePasswordFn(data)
			form.reset()
		}
	}

	return (
		<FormProvider {...form}>
			<Form onSubmit={form.handleSubmit((data) => updatePassword(data))}>
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
						<Button>{t('ns_auth:profile.change_password')}</Button>
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
