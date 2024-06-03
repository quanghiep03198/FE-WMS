import LanguaguesSelect from '@/app/_components/_shared/-languages-select';
import ThemeToggle from '@/app/_components/_shared/-theme-toggle';
import GlobalTransportImage from '@/assets/images/global-transport.svg';
import { Div, Icon, Label, Typography } from '@/components/ui';
import { Stepper, type TStep } from '@/components/ui/@custom/step';
import tw from 'tailwind-styled-components';
import DepartmentSelectionForm from './-department-selection-form';
import LoginForm from './-login-form';

const steps: TStep[] = [
	{
		name: 'ns_auth:step_verify_account',
		status: 'current'
	},
	{
		name: 'ns_auth:step_select_department',
		status: 'upcoming'
	}
];

export const PageComposition = {
	ThemeSelector: () => (
		<Div className='fixed right-2 top-2 z-50'>
			<ThemeToggle />
		</Div>
	),
	Heading: ({ title, description }: { title: string; description: string }) => (
		<Div className='w-full max-w-lg space-y-1 text-center'>
			<Typography variant='h5' className='whitespace-nowrap text-center font-bold'>
				{title}
			</Typography>
			<Typography variant='small' color='muted'>
				{description}
			</Typography>
		</Div>
	),
	FormSection: () => (
		<Stepper.Provider data={steps}>
			<Stepper.Panel value={1}>
				<LoginForm />
			</Stepper.Panel>
			<Stepper.Panel value={2}>
				<DepartmentSelectionForm />
			</Stepper.Panel>
		</Stepper.Provider>
	),
	LanguageSelector: () => (
		<Div className='flex w-full items-center justify-center gap-x-2'>
			<Label className='inline-flex items-center gap-x-2'>
				<Icon name='Globe' strokeWidth={1} />
				Language
			</Label>
			<Div className='basis-32'>
				<LanguaguesSelect />
			</Div>
		</Div>
	),
	SideImage: () => (
		<Div className='hidden h-full max-h-full flex-grow flex-col items-center justify-center @container xl:flex'>
			<Image src={GlobalTransportImage} alt='Global Transport' loading='eager' />
		</Div>
	)
};

const Image = tw.img`@xl:max-w-xl @3xl:max-w-2xl sticky top-0 mx-auto hidden w-full xl:block`;
