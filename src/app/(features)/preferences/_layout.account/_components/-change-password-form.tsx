import { useAuth } from '@/common/hooks/use-auth'
import { Button, Div, Form as FormProvider, InputFieldControl, Typography } from '@/components/ui'
import bcrypt from 'bcryptjs-react'
import { debounce } from 'lodash'
import React, { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import tw from 'tailwind-styled-components'
import { updatePasswordUser } from '../_apis/account.api'

const ChangePasswordForm: React.FC = () => {
	const { mutateAsync: updatePasswordFn } = updatePasswordUser()

	const { user } = useAuth()

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
				message: 'Current password is incorrect'
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
		if (data.password.length < 6) {
			setError('password', {
				type: 'manual',
				message: 'New password must be at least 6 characters long'
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
					<Legend>Update password</Legend>
					<Typography variant='small' color='muted'>
						Change password to access to your account
					</Typography>

					<Div className='space-y-6'>
						<InputFieldControl label='Current password' name='currentPassword' placeholder='********' />
						<InputFieldControl label='New password' name='password' placeholder='********' />
						<Button>Change password</Button>
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
