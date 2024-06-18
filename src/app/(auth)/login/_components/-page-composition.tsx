import { LanguageSelect } from '@/app/_components/_shared/-language-selector'
import ThemeToggle from '@/app/_components/_shared/-theme-toggle'
import GlobalTransportImage from '@/assets/images/global-transport.svg'
import { cn } from '@/common/utils/cn'
import { Div, Icon, Label, Tooltip, Typography, buttonVariants } from '@/components/ui'
import { Stepper, type TStep } from '@/components/ui/@custom/step'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import LoginForm from './-login-form'
import WorkplaceSelectionForm from './-workplace-selection-form'

const steps: TStep[] = [
	{
		name: 'ns_auth:steps.verify_account',
		status: 'current'
	},
	{
		name: 'ns_auth:steps.select_department',
		status: 'upcoming'
	}
]

const ThemeSelector: React.FC = () => {
	const { t } = useTranslation('ns_common')
	return (
		<Div className='fixed right-2 top-2 z-50'>
			<Tooltip message={`${t('ns_common:theme')} (ctrl+alt+t)`} contentProps={{ side: 'left' }}>
				<ThemeToggle />
			</Tooltip>
		</Div>
	)
}

const HomeNavigator: React.FC = () => {
	return (
		<Div className='!fixed left-2 top-2 z-10'>
			<Tooltip message='Home' contentProps={{ side: 'right' }}>
				<Link to='/' className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}>
					<Icon name='ArrowLeft' />
				</Link>
			</Tooltip>
		</Div>
	)
}

const FormSection: React.FC = () => {
	return (
		<Stepper.Provider data={steps}>
			<Stepper.Panel value={1}>
				<LoginForm />
			</Stepper.Panel>
			<Stepper.Panel value={2}>
				<WorkplaceSelectionForm />
			</Stepper.Panel>
		</Stepper.Provider>
	)
}

const FormHeading: React.FC<{ title: string; description: string }> = ({ title, description }) => {
	return (
		<Div className='w-full max-w-lg space-y-1 text-center'>
			<Typography variant='h5' className='whitespace-nowrap text-center font-bold'>
				{title}
			</Typography>
			<Typography variant='small' color='muted'>
				{description}
			</Typography>
		</Div>
	)
}

const LanguageSelector: React.FC = () => {
	return (
		<Div className='flex w-full items-center justify-center gap-x-2'>
			<Label className='inline-flex items-center gap-x-2'>
				<Icon name='Globe' strokeWidth={1} />
				Language
			</Label>
			<Div className='basis-32'>
				<LanguageSelect />
			</Div>
		</Div>
	)
}

const SideImage: React.FC = () => {
	return (
		<Div className='hidden h-full max-h-full flex-grow flex-col items-center justify-center @container xl:flex'>
			<Div
				as='img'
				src={GlobalTransportImage}
				alt='Global Transport'
				loading='eager'
				className='sticky top-0 mx-auto hidden w-full @xl:max-w-xl @3xl:max-w-3xl xl:block'
			/>
		</Div>
	)
}

export default {
	FormHeading,
	FormSection,
	SideImage,
	HomeNavigator,
	LanguageSelector,
	ThemeSelector
}
