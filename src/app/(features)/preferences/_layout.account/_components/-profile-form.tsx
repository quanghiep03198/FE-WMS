import { useAuth } from '@/common/hooks/use-auth'
import { Button, Div, Form as FormProvider, InputFieldControl, Typography } from '@/components/ui'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'

const ProfileForm: React.FC = () => {
	const { user } = useAuth()
	const { t } = useTranslation()

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
					<Legend>{t('ns_auth:profile.public_profile')}</Legend>
					<Typography variant='small' color='muted'>
						{t('ns_auth:profile.this_will_be')}{' '}
					</Typography>

					<Div className='space-y-6'>
						<InputFieldControl label={t('ns_auth:profile.display_name')} name='display_name' />
						<InputFieldControl label={t('ns_auth:profile.email')} name='email' />
						<InputFieldControl label={t('ns_auth:profile.company')} name='company_name' disabled />
						<Button>{t('ns_auth:profile.save_changes')}</Button>
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
