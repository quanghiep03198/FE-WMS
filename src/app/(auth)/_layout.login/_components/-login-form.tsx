import { useLocalStorage } from '@/common/hooks/use-storage';
import { ICompany, IDepartment } from '@/common/types/entities';
import { Box, Button, Checkbox, Form, Icon, InputFieldControl, Label, SelectFieldControl } from '@/components/ui';
import { LoginFormValues, loginSchema } from '@/schemas/auth.schema';
import { AuthService } from '@/services/auth.service';
import { CompanyService } from '@/services/company.service';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from '@tanstack/react-router';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import tw from 'tailwind-styled-components';

const LoginForm: React.FC = () => {
	const navigate = useNavigate();
	const { t } = useTranslation(['company.ns', 'auth.ns']);
	const [companies, setCompanies] = useState<ICompany[]>([]);
	const [departments, setDepartments] = useState<IDepartment[]>([]);

	const [authenticated, setAuthenticated] = useState<boolean>(false);
	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		mode: 'onChange'
	});

	const email = form.watch('email');
	const password = form.watch('password');

	const [savedAccount, setAccountToSave, removeSavedAccount] = useLocalStorage<LoginFormValues['email'] | null>('account');

	const loginMutation = useMutation({
		mutationKey: ['AUTH'],
		mutationFn: AuthService.login,
		onSuccess: () => {
			setAuthenticated(true);
		},
		onError: () => {
			setAuthenticated(false);
		}
	});

	/**
	 *
	 */
	const companyQuery = useQuery({
		enabled: authenticated,
		queryKey: ['COMPANY'],
		queryFn: () => CompanyService.getDepartments(),
		onSuccess: (data: any) => {
			if (Array.isArray(data)) {
				setDepartments(data.map((item) => item?.departments).flatMap((item) => ({ label: item?.department_name, value: item?.department_code })));
				setCompanies(data.map((item) => ({ label: item?.company_name, value: item?.company_code })));
			}
		}
	});

	useEffect(() => {
		console.log(savedAccount);
		if (savedAccount) form.setValue('email', savedAccount);
	}, []);

	useEffect(() => {
		const timeout: NodeJS.Timeout = setTimeout(() => {
			if (!email || !password) return;

			console.log({ email, password });
			loginMutation.mutateAsync({
				email,
				password
			} as LoginFormValues);
		}, 200);

		return () => {
			clearTimeout(timeout);
		};
	}, [password]);

	const handleToggleSaveAccount = useCallback((checked: boolean) => {
		if (checked) {
			if (form.getValues('email')) setAccountToSave(form.getValues('email'));
		} else removeSavedAccount();
	}, []);

	const handleLoginWithEmail = (data: Required<LoginFormValues>) => {
		console.log(data);
		navigate({ to: '/' });
	};

	return (
		<Form {...form}>
			<StyledForm onSubmit={form.handleSubmit(handleLoginWithEmail)}>
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
				<SelectFieldControl label={t('company.ns:company')} name='company_code' options={[]} disabled={!authenticated} control={form.control} />
				<SelectFieldControl label={t('company.ns:department')} name='department_code' options={[]} disabled={!authenticated} control={form.control} />

				<Box className='flex items-center justify-between'>
					<Box className='flex items-center space-x-2'>
						<Checkbox type='button' id='remember-checkbox' defaultChecked={Boolean(savedAccount)} onCheckedChange={handleToggleSaveAccount} />
						<Label htmlFor='remember-checkbox'>{t('auth.ns:login_remember_account_label')}</Label>
					</Box>
					<Button variant='link' asChild className='px-0'>
						<Link to='/'>{t('auth.ns:login_forgot_password_label')}</Link>
					</Button>
				</Box>
				<Button type='submit' className='w-full gap-x-2' disabled={loginMutation.isPending}>
					<Icon name='LogIn' />
					Log in
				</Button>
			</StyledForm>
		</Form>
	);
};

const StyledForm = tw.form`border border-border w-full flex flex-col items-stretch rounded gap-y-6 px-6 sm:px-4 py-6 bg-background dark:bg-popover`;

export default LoginForm;
