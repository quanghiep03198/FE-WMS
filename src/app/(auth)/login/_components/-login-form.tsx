import { USER_PROVIDE_TAG } from '@/app/(auth)/_apis/auth.api'
import { useAuth } from '@/common/hooks/use-auth'
import { Button, Checkbox, Div, Form as FormProvider, Icon, InputFieldControl, Label } from '@/components/ui'
import { useStepContext } from '@/components/ui/@custom/stepper'
import { AuthService } from '@/services/auth.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useLocalStorageState } from 'ahooks'
import { isEmpty } from 'lodash'
import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import { LoginFormValues, loginSchema } from '../_schemas/login.schema'

const LoginForm: React.FC = () => {
	const { t } = useTranslation()
	const { dispatch } = useStepContext()
	const { token: accessToken, setAccessToken } = useAuth()
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

	const { mutateAsync: login, isPending } = useMutation({
		mutationKey: [USER_PROVIDE_TAG],
		mutationFn: AuthService.login,
		onMutate: () => {
			return toast.loading(t('ns_common:notification.processing_request'))
		},
		onSuccess: async (data, _variables, context) => {
			setAccessToken(data?.metadata?.token) // Store user's access token
			toast.success(t('ns_common:notification.success'), { id: context })
		},
		onError(_error, _variables, context) {
			toast.error(t('ns_auth:notification.login_failed'), { id: context })
		}
	})

	const username = form.watch('username')

	const handlePersistAccount = useCallback(
		(checked: boolean) => {
			const persistValue = checked && !isEmpty(username) ? username : undefined
			setPersistedAccount(persistValue)
		},
		[username]
	)

	useEffect(() => {
		// If user's profile is retrieved successfully, then go to next step
		if (accessToken) dispatch({ type: 'NEXT_STEP' })
	}, [accessToken])

	return (
		<FormProvider {...form}>
			<Form onSubmit={form.handleSubmit((data) => login(data))}>
				<InputFieldControl
					label={t('ns_auth:labels.username')}
					placeholder={t('ns_auth:labels.username')}
					name='username'
					autoComplete='username'
					defaultValue={persistedAccount}
				/>
				<InputFieldControl
					label={t('ns_auth:labels.password')}
					placeholder='********'
					autoComplete='current-password'
					type='password'
					name='password'
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

const Form = tw.form`flex flex-col items-stretch gap-y-6`

export default LoginForm
