import { USER_PROVIDE_TAG, useGetUserProfile } from '@/app/_composables/-user.composable'
import { useAuth, useAuthStore } from '@/common/hooks/use-auth'
import { Button, Checkbox, Div, Form as FormProvider, Icon, InputFieldControl, Label } from '@/components/ui'
import { StepContext } from '@/components/ui/@custom/step'
import { LoginFormValues, loginSchema } from '@/schemas/auth.schema'
import { AuthService } from '@/services/auth.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useLocalStorageState } from 'ahooks'
import _ from 'lodash'
import React, { useCallback, useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'

const LoginForm: React.FC = () => {
	const { t } = useTranslation()
	const { steps, dispatch } = useContext(StepContext)
	const [persistedAccount, setPersistedAccount] = useLocalStorageState<string>('persistedAccount', {
		defaultValue: undefined,
		listenStorageChange: true
	})
	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		mode: 'onChange',
		defaultValues: {
			username: persistedAccount,
			password: ''
		}
	})

	const { accessToken, setAccessToken, setUserProfile } = useAuthStore()

	const { data: user } = useGetUserProfile()

	const { mutateAsync: login, isPending } = useMutation({
		mutationKey: [USER_PROVIDE_TAG],
		mutationFn: AuthService.login,
		onMutate: () => toast.loading(t('ns_common:notification.processing_request'), { id: 'login' }),
		onSuccess: (data) => {
			// Store user's access token
			setAccessToken(data.metadata?.token)
			toast.success(t('ns_auth:notification.login_success'), { id: 'login' })
		},
		onError(_err) {
			toast.error(t('ns_auth:notification.login_failed'), { id: 'login' })
		}
	})

	const username = form.watch('username')

	const handlePersistAccount = useCallback(
		(checked: boolean) => {
			const persistValue = checked && !_.isEmpty(username) ? username : undefined
			setPersistedAccount(persistValue)
		},
		[username]
	)

	useEffect(() => {
		// If user's profile is retrieved successfully, then go to next step
		if ([user, accessToken].every((item) => !_.isNil(item))) {
			setUserProfile(user)
			dispatch({ type: 'NEXT_STEP' })
		}
	}, [steps.currentStep, user, accessToken])

	return (
		<FormProvider {...form}>
			<Form onSubmit={form.handleSubmit((data) => login(data))}>
				<InputFieldControl
					label={t('ns_auth:labels.username')}
					placeholder={t('ns_auth:labels.username')}
					name='username'
					autoComplete='username'
					defaultValue={persistedAccount}
					control={form.control}
				/>
				<InputFieldControl
					label={t('ns_auth:labels.password')}
					placeholder='********'
					autoComplete='current-password'
					type='password'
					name='password'
					control={form.control}
				/>
				<Div className='flex items-center justify-between'>
					<Div className='flex items-center space-x-2'>
						<Checkbox
							type='button'
							id='persist-account-checkbox'
							onCheckedChange={handlePersistAccount}
							defaultChecked={Boolean(persistedAccount)}
						/>
						<Label htmlFor='persist-account-checkbox'>{t('ns_auth:labels.remember_account')}</Label>
					</Div>
					<Button variant='link' asChild className='px-0'>
						<Link to='/'>{t('ns_auth:labels.forgot_password')}</Link>
					</Button>
				</Div>
				<Button type='submit' className='w-full gap-x-2' size='lg' disabled={isPending}>
					<Icon name='LogIn' />
					{t('ns_common:actions.login')}
				</Button>
			</Form>
		</FormProvider>
	)
}

const Form = tw.form`w-full flex flex-col items-stretch gap-y-6`

export default LoginForm
