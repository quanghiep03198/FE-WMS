import { Button, Checkbox, Div, Form as FormProvider, Icon, InputFieldControl, Label } from '@/components/ui'
import { StepContext } from '@/components/ui/@custom/step'
import { LoginFormValues, loginSchema } from '@/schemas/auth.schema'
import { AuthService } from '@/services/auth.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useLocalStorageState } from 'ahooks'
import _ from 'lodash'
import React, { useContext, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'

const LoginForm: React.FC = () => {
	const { steps, dispatch } = useContext(StepContext)
	const { t } = useTranslation()
	const persistAccountCheckboxRef = useRef<typeof Checkbox.prototype>(null)
	const [persistedAccount, setPersistedAccount] = useLocalStorageState<string>('persistedAccount', {
		defaultValue: undefined,
		listenStorageChange: true
	})
	const [accessToken, setAccessToken] = useLocalStorageState<string>('accessToken', {
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

	const username = form.watch('username')

	const {
		mutateAsync: login,
		isPending,
		isSuccess
	} = useMutation({
		mutationKey: ['auth', accessToken],
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

	useEffect(() => {
		// If user's profile is retrieved successfully, then go to next step
		if (isSuccess || Boolean(accessToken)) dispatch({ type: 'NEXT_STEP' })
	}, [steps.currentStep, isSuccess, persistedAccount])

	useEffect(() => {
		if (persistAccountCheckboxRef.current?.checked && !_.isEmpty(username)) setPersistedAccount(username)
		else setPersistedAccount(undefined)
	}, [username, persistedAccount, persistAccountCheckboxRef.current])

	return (
		<FormProvider {...form}>
			<Form onSubmit={form.handleSubmit((data) => login(data))}>
				<InputFieldControl
					label={t('ns_auth:labels.username')}
					placeholder={t('ns_auth:labels.username')}
					name='username'
					defaultValue={persistedAccount}
					control={form.control}
				/>
				<InputFieldControl
					label={t('ns_auth:labels.password')}
					placeholder='********'
					type='password'
					name='password'
					control={form.control}
				/>
				<Div className='flex items-center justify-between'>
					<Div className='flex items-center space-x-2'>
						<Checkbox
							ref={persistAccountCheckboxRef}
							type='button'
							id='remember-checkbox'
							defaultChecked={Boolean(persistedAccount)}
						/>
						<Label htmlFor='remember-checkbox'>{t('ns_auth:labels.remember_account')}</Label>
					</Div>
					<Button variant='link' asChild className='px-0'>
						<Link to='/'>{t('ns_auth:labels.forgot_password')}</Link>
					</Button>
				</Div>
				<Button type='submit' className='w-full gap-x-2' disabled={isPending}>
					<Icon name='LogIn' />
					{t('ns_common:actions.login')}
				</Button>
			</Form>
		</FormProvider>
	)
}

const Form = tw.form`w-full flex flex-col items-stretch gap-y-6`

export default LoginForm
