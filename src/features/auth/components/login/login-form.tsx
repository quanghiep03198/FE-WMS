import { TRANSLATED_FACTORY } from '@common/constants/constants'
import env from '@common/utils/env'
import { Div } from '@components/customs/div'
import { InputFieldControl } from '@components/forms/input'
import { Button } from '@components/ui/button'
import { Checkbox } from '@components/ui/checkbox'
import { FormItem, FormLabel, Form as FormProvider } from '@components/ui/form'
import { Icon } from '@components/ui/icon'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import { AuthQueryKeys } from '@features/auth/hooks/use-profile-request'
import { AuthService } from '@features/auth/services/auth.service'
import { zodResolver } from '@hookform/resolvers/zod'
import useAuth from '@hooks/use-auth'
import { useMutation } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { useLocalStorageState } from 'ahooks'
import { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import type { LoginFormValues } from '../../schemas/login.schema'
import { loginSchema } from '../../schemas/login.schema'

const LoginForm: React.FC = () => {
	const { t } = useTranslation()
	const { setUserProfile, setAccessToken } = useAuth()
	const [persistedAccount, setPersistedAccount] = useLocalStorageState<string>('persistedAccount', {
		defaultValue: '',
		listenStorageChange: true
	})
	const [shouldPersistAccount, setShouldPersistAccount] = useState<boolean>(!!persistedAccount)

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		mode: 'onChange',
		defaultValues: {
			username: persistedAccount ?? '',
			password: ''
		}
	})

	const { mutateAsync: login, isPending } = useMutation({
		meta: { invalidates: [[AuthQueryKeys.PROFILE]] },
		mutationFn: AuthService.login,
		onSuccess: async (data) => {
			if (typeof data.metadata?.accessToken !== 'string') return
			setAccessToken(data.metadata.accessToken)
			if (data.metadata?.user) setUserProfile(data.metadata.user)
		}
	})

	const username = useWatch({ name: 'username', control: form.control })

	useEffect(() => {
		if (shouldPersistAccount) {
			setPersistedAccount(username)
		} else {
			setPersistedAccount('')
			localStorage.removeItem('persistedAccount')
		}
	}, [username, shouldPersistAccount])

	return (
		<FormProvider {...form}>
			<Form onSubmit={form.handleSubmit((data) => login(data))}>
				<InputFieldControl
					autoComplete='username'
					defaultValue={persistedAccount}
					label={t('ns_auth:fields.username')}
					name='username'
					placeholder={t('ns_auth:fields.username')}
				/>
				<InputFieldControl
					autoComplete='current-password'
					label={t('ns_auth:fields.password')}
					name='password'
					placeholder='********'
					type='password'
				/>

				<FormItem>
					<FormLabel>{t('ns_common:common_fields.factory_code')}</FormLabel>
					<Input
						readOnly
						className='cursor-auto'
						value={t(TRANSLATED_FACTORY[env('VITE_APP_TENANT')], { ns: 'ns_common' })}
					/>
				</FormItem>
				<Div className='flex items-center justify-between'>
					<Div className='flex items-center space-x-2'>
						<Checkbox
							checked={shouldPersistAccount}
							defaultChecked={Boolean(persistedAccount)}
							id='persist-account-checkbox'
							type='button'
							onCheckedChange={(value) => setShouldPersistAccount(Boolean(value))}
						/>
						<Label htmlFor='persist-account-checkbox'>{t('ns_auth:labels.remember_account')}</Label>
					</Div>
					<Button asChild className='px-0' variant='link'>
						<Link to='/'>{t('ns_auth:labels.forgot_password')}</Link>
					</Button>
				</Div>
				<Button className='w-full gap-x-2' disabled={isPending} size='lg' type='submit'>
					<Icon
						aria-busy={isPending}
						className='aria-busy:animate-spin'
						name={isPending ? 'LoaderCircle' : 'LogIn'}
					/>
					{t('ns_common:actions.login')}
				</Button>
			</Form>
		</FormProvider>
	)
}

const Form = tw.form`flex flex-col items-stretch gap-y-6`

export default LoginForm
