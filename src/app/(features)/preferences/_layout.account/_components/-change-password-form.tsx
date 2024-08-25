import { Button, Div, Form as FormProvider, InputFieldControl, Typography } from '@/components/ui'
import React from 'react'
import { useForm } from 'react-hook-form'
import tw from 'tailwind-styled-components'

const ChangePasswordForm: React.FC = () => {
	const form = useForm({})

	return (
		<FormProvider {...form}>
			<Form>
				{/* Public profile */}
				<Fieldset>
					<Legend>Update password</Legend>
					<Typography variant='small' color='muted'>
						Change password to access to your account
					</Typography>

					<Div className='space-y-6'>
						<InputFieldControl
							label='Current password'
							name='currentPassword'
							control={form.control}
							placeholder='********'
						/>
						<InputFieldControl
							label='New password'
							name='newPassword'
							control={form.control}
							placeholder='********'
						/>
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
