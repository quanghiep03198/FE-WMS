import LanguaguesSelect from '@/app/_components/_shared/-languages-select';
import ThemeToggle from '@/app/_components/_shared/-theme-toggle';
import { Box, Icon, Label, Typography } from '@/components/ui';
import { createFileRoute } from '@tanstack/react-router';
import { Helmet } from 'react-helmet';
import LoginForm from './_components/-login-form';
import { useTranslation } from 'react-i18next';

/**
 * @description Router declaration
 */
export const Route = createFileRoute('/(auth)/_layout/login/')({
	component: LoginPage
});

/**
 * @description Login page component
 */
export default function LoginPage() {
	const { t } = useTranslation(['common.ns', 'company.ns', 'auth.ns']);

	return (
		<>
			<Helmet>
				<title>Login</title>
				<meta name='title' content='Greenland Warehouse Management System' />
				<meta name='description' content='Greenland warehouse management authentication' />
			</Helmet>
			<Box className='scrollbar-none relative flex min-h-screen w-full flex-grow flex-col items-center justify-center overflow-y-auto bg-background p-4 text-foreground'>
				<Box className='absolute right-4 top-2'>
					<ThemeToggle />
				</Box>
				<Box className='flex w-full max-w-md flex-1 flex-grow flex-col items-center justify-center gap-y-6 py-10'>
					{/*  */}
					<Box className='w-full space-y-1 text-center'>
						<Typography variant='h5' className='whitespace-nowrap text-center font-bold'>
							{t('auth.ns:login_title')}
						</Typography>
						<Typography variant='small' color='muted'>
							{t('auth.ns:login_description')}
						</Typography>
					</Box>
					{/* Login form */}
					<LoginForm />
					{/* Languages selector */}
					<Box className='mx-auto flex w-full max-w-56 items-center gap-x-2'>
						<Label className='inline-flex flex-1 items-center gap-x-2 whitespace-nowrap'>
							<Icon name='Globe' strokeWidth={1} /> Language
						</Label>
						<LanguaguesSelect />
					</Box>
					{/* Footer */}
					<Typography variant='small' color='muted' className='block w-full border-t border-border pt-6 text-center'>
						©{new Date().getFullYear()} GreenLand, Inc. All rights reserved.
					</Typography>
				</Box>
			</Box>
		</>
	);
}
