import { Button, Div, Form as FormProvider, Icon, InputFieldControl, Typography } from '@components/ui'
import { useUpdateProfileMutation } from '@features/auth/hooks/use-profile-request'
import { zodResolver } from '@hookform/resolvers/zod'
import useAuth from '@hooks/use-auth'
import React from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import type { UpdateProfileFormValues } from '../schemas/update-profile.schema'
import { updateProfileFormValues } from '../schemas/update-profile.schema'

const ProfileForm: React.FC = () => {
	const { user } = useAuth()
	const { t } = useTranslation()

	const { mutateAsync, isPending, isError } = useUpdateProfileMutation()

	const form = useForm<UpdateProfileFormValues>({
		resolver: zodResolver(updateProfileFormValues),
		defaultValues: {
			display_name: user?.display_name,
			email: user?.email ?? '',
			employee_code: user?.employee_code ?? t('ns_common:titles.unknown')
		}
	})

	return (
		<FormProvider {...form}>
			<Form onSubmit={form.handleSubmit((data) => mutateAsync(data))}>
				{/* Public profile */}
				<Fieldset>
					<Legend>{t('ns_auth:profile.public_profile')}</Legend>
					<Typography variant='small' color='muted'>
						{t('ns_auth:profile.this_will_be')}{' '}
					</Typography>
					<Div className='space-y-6'>
						<InputFieldControl label={t('ns_auth:profile.display_name')} name='display_name' />
						<InputFieldControl label={t('ns_auth:profile.email')} name='email' />
						<InputFieldControl disabled label={t('ns_auth:fields.employee_code')} name='employee_code' />
						<Button disabled={isPending}>
							{isPending && <Icon name='LoaderCircle' className='animate-spin' />}{' '}
							{isError ? t('ns_common:actions.retry') : t('ns_auth:profile.save_changes')}
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

export default ProfileForm
