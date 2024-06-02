import LanguaguesSelect from '@/app/_components/_shared/-languages-select';
import ThemeToggle from '@/app/_components/_shared/-theme-toggle';
import GlobalTransportImage from '@/assets/images/global-transport.svg';
import { Div, Icon, Label, Typography } from '@/components/ui';
import { createFileRoute } from '@tanstack/react-router';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import FormSection from './_components/-form-section';
import tw from 'tailwind-styled-components';
import { LoginProvider } from './_context/-login-context';

export const Route = createFileRoute('/(auth)/_layout/login/')({
	component: LoginPage
});

export default function LoginPage() {
	const { t } = useTranslation(['common.ns', 'company.ns', 'auth.ns']);

	return (
		<>
			<Helmet>
				<title>Login</title>
				<meta name='title' content='Greenland Warehouse Management System' />
				<meta name='description' content='Greenland warehouse management authentication' />
			</Helmet>
			<Div className='fixed right-2 top-2 z-50'>
				<ThemeToggle />
			</Div>
			<Div className='relative grid min-h-screen w-full grid-cols-1 overflow-y-auto bg-background text-foreground scrollbar-none xl:grid-cols-2'>
				<Div className=' hidden h-full max-h-full flex-grow flex-col items-center justify-center @container xl:flex'>
					<SideImage src={GlobalTransportImage} alt='Global Transport' loading='eager' />
				</Div>
				<Div className='mx-auto flex h-full w-full max-w-lg flex-1 flex-grow flex-col items-center justify-center gap-y-6 overflow-y-auto px-2 sm:py-10 md:py-10'>
					{/* Page heading/description */}
					<Div className='w-full max-w-lg space-y-1 text-center'>
						<Typography variant='h5' className='whitespace-nowrap text-center font-bold'>
							{t('auth.ns:login_title')}
						</Typography>
						<Typography variant='small' color='muted'>
							{t('auth.ns:login_description')}
						</Typography>
					</Div>
					{/* Form section */}
					<LoginProvider>
						<FormSection />
					</LoginProvider>
					{/* Language selector */}
					<Div className='flex w-full items-center justify-center gap-x-2'>
						<Label className='inline-flex items-center gap-x-2'>
							<Icon name='Globe' strokeWidth={1} />
							Language
						</Label>
						<Div className='basis-32'>
							<LanguaguesSelect />
						</Div>
					</Div>
				</Div>
			</Div>
		</>
	);
}

const SideImage = tw.img`@xl:max-w-xl @3xl:max-w-2xl sticky top-0 mx-auto hidden w-full xl:block`;
