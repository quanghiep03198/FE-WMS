import { useAuth } from '@/common/hooks/use-auth'
import { Button, Div, Form as FormProvider, InputFieldControl, Typography } from '@/components/ui'
import React from 'react'
import { useForm } from 'react-hook-form'
import tw from 'tailwind-styled-components'

const ProfileForm: React.FC = () => {
	const { user } = useAuth()

	const form = useForm({
		defaultValues: {
			display_name: user.display_name,
			email: user.email ?? 'example@email.com',
			company_name: user.company_name
		}
	})

	return (
		<FormProvider {...form}>
			<Form>
				{/* Public profile */}
				<Fieldset>
					<Legend>Public profile</Legend>
					<Typography variant='small' color='muted'>
						This will be displayed on your profile
					</Typography>

					<Div className='space-y-6'>
						<InputFieldControl label='Display name' name='display_name' />
						<InputFieldControl label='Email' name='email' />
						<InputFieldControl label='Company' name='company_name' disabled />
						<Button>Save changes</Button>
					</Div>
				</Fieldset>
			</Form>
		</FormProvider>
	)
}

const Form = tw.form`max-w-1/2 sm:max-w-full w-full sm:mx-auto`
const Fieldset = tw.fieldset`flex flex-col items-stretch gap-y-6`
const Legend = tw.legend`text-lg font-semibold`

export default ProfileForm
