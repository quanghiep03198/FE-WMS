import { Button, Checkbox, Div, Form as FormProvider, Icon, InputFieldControl, Label } from '@/components/ui'
import { useStepContext } from '@/components/ui/@custom/stepper'
import { AuthService } from '@/features/auth/services/auth.service'
import useAuth from '@/hooks/use-auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useLocalStorageState } from 'ahooks'
import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import tw from 'tailwind-styled-components'
import type { LoginFormValues } from '../-schemas/login.schema'
import { loginSchema } from '../-schemas/login.schema'
import { AuthQueryKeys } from '../../../-hooks/use-user-asm'

const LoginForm: React.FC = () => {
	const { t } = useTranslation()
	const { dispatch } = useStepContext()
	const { setUserProfile, setAccessToken } = useAuth()
	const [persistedAccount, setPersistedAccount] = useLocalStorageState<string>('persistedAccount', {
		defaultValue: undefined,
		listenStorageChange: true
	})
	const [shouldPersistAccount, setShouldPersistAccount] = useState<boolean>(!!persistedAccount)

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		mode: 'onChange',
		defaultValues: {
			username: persistedAccount,
			password: ''
		}
	})

	const { mutateAsync: login, isPending } = useMutation({
		mutationKey: [AuthQueryKeys.PROFILE],
		mutationFn: AuthService.login,
		onMutate: () => {
			return toast.loading(t('ns_common:notification.processing_request'))
		},
		onSuccess: async (data, _variables, context) => {
			setUserProfile(data?.metadata?.user)
			setAccessToken(data?.metadata?.accessToken)
			toast.success(t('ns_common:notification.success'), { id: context })
			dispatch({ type: 'NEXT_STEP' })
		},
		onError(_error, _variables, context) {
			toast.error(t('ns_auth:notification.login_failed'), { id: context })
		}
	})

	const username = useWatch({ name: 'username', control: form.control })

	useEffect(() => {
		if (shouldPersistAccount) {
			setPersistedAccount(username)
		} else {
			setPersistedAccount(undefined)
			localStorage.removeItem('persistedAccount')
		}
	}, [username, shouldPersistAccount])

	return (
		<FormProvider {...form}>
			<Form onSubmit={form.handleSubmit((data) => login(data))}>
				<InputFieldControl
					label={t('ns_auth:fields.username')}
					placeholder={t('ns_auth:fields.username')}
					name='username'
					autoComplete='username'
					defaultValue={persistedAccount}
				/>
				<InputFieldControl
					label={t('ns_auth:fields.password')}
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
							checked={shouldPersistAccount}
							onCheckedChange={(value) => setShouldPersistAccount(Boolean(value))}
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
