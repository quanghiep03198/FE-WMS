import useQueryParams from '@/common/hooks/use-query-params';
import { useLocalStorage } from '@/common/hooks/use-storage';
import { AuthContext } from '@/components/providers/auth-provider';
import { Div, Button, Checkbox, Form as FormProvider, Icon, InputFieldControl, Label } from '@/components/ui';
import { LoginFormValues, loginSchema } from '@/schemas/auth.schema';
import { AuthService } from '@/services/auth.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import React, { useCallback, useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import tw from 'tailwind-styled-components';

const LoginForm: React.FC = () => {
	const { t } = useTranslation(['company.ns', 'auth.ns']);
	const { searchParams, setParams } = useQueryParams();
	const { setAuthState } = useContext(AuthContext);
	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		mode: 'onChange'
	});
	const [savedAccount, setAccountToSave, removeSavedAccount] = useLocalStorage<LoginFormValues['email'] | null>('account');

	useEffect(() => {
		if (savedAccount) form.setValue('email', savedAccount);
	}, []);

	const handleToggleSaveAccount = useCallback((checked: boolean) => {
		if (checked) {
			if (!!form.getValues('email')) setAccountToSave(form.getValues('email'));
		} else removeSavedAccount();
	}, []);

	const loginMutation = useMutation({
		mutationKey: ['auth'],
		mutationFn: AuthService.login,
		onMutate: () => {
			toast.loading('Processing ...', { id: 'login' });
		},
		onSuccess: (data) => {
			setParams({ step: searchParams.step + 1 });
			setAuthState({ authenticated: true, user: data.user, accessToken: data.accessToken });
			toast.success('Logged in successfully', { id: 'login' });
		},
		onError(error) {
			console.log(error?.response);
			toast.error('Failed to login', { id: 'login' });
		}
	});

	return (
		<FormProvider {...form}>
			<Form onSubmit={form.handleSubmit((data) => loginMutation.mutateAsync(data))}>
				<InputFieldControl
					label={t('auth.ns:email')}
					placeholder='example@email.com'
					type='email'
					name='email'
					control={form.control}
					messageMode='tooltip'
				/>
				<InputFieldControl
					label={t('auth.ns:password')}
					placeholder='********'
					type='password'
					name='password'
					control={form.control}
					messageMode='tooltip'
				/>

				<Div className='flex items-center justify-between'>
					<Div className='flex items-center space-x-2'>
						<Checkbox type='button' id='remember-checkbox' defaultChecked={Boolean(savedAccount)} onCheckedChange={handleToggleSaveAccount} />
						<Label htmlFor='remember-checkbox'>{t('auth.ns:login_remember_account_label')}</Label>
					</Div>
					<Button variant='link' asChild className='px-0'>
						<Link to='/'>{t('auth.ns:login_forgot_password_label')}</Link>
					</Button>
				</Div>
				<Button type='submit' className='w-full gap-x-2' disabled={loginMutation.isPending}>
					<Icon name='LogIn' />
					Log in
				</Button>
			</Form>
		</FormProvider>
	);
};

const Form = tw.form`w-full flex flex-col items-stretch gap-y-6`;

export default LoginForm;
