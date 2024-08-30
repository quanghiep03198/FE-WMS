import { LanguageSelect } from '@/app/_components/_shared/-language-selector'
import ThemeToggle from '@/app/_components/_shared/-theme-toggle'
import { cn } from '@/common/utils/cn'
import { Div, Icon, Label, Tooltip, Typography, buttonVariants } from '@/components/ui'
import { Stepper, type TStep } from '@/components/ui/@custom/step'
import { Link } from '@tanstack/react-router'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import LoginForm from './-login-form'
import WorkplaceSelectionForm from './-workplace-selection-form'

const Container = tw.div`relative grid place-content-center min-h-screen w-full overflow-y-auto bg-background text-foreground scrollbar-none scrollbar`
const FormSection = tw.section`mx-auto flex w-full max-w-xl flex-grow flex-col items-center justify-center gap-y-6 px-4 z-10`

const ThemeSelector: React.FC = () => {
	return (
		<Div className='fixed right-2 top-2 z-50'>
			<ThemeToggle tooltipProps={{ contentProps: { side: 'left' } }} />
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

const FormFieldset: React.FC = () => {
	const { t, i18n } = useTranslation()

	const steps: TStep[] = useMemo(
		() => [
			{
				name: t('ns_auth:steps.verify_account'),
				status: 'current'
			},
			{
				name: t('ns_auth:steps.select_department'),
				status: 'upcoming'
			}
		],
		[i18n.language]
	)

	return (
		<Stepper.Provider data={steps} enableChangeStep={false}>
			<Stepper.Panel value={1}>
				<LoginForm />
			</Stepper.Panel>
			<Stepper.Panel value={2}>
				<WorkplaceSelectionForm />
			</Stepper.Panel>
		</Stepper.Provider>
	)
}

const FormHeading: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Div className='w-full max-w-xl space-y-1 text-center'>
			<Typography variant='h5' className='whitespace-nowrap text-center font-bold'>
				{t('ns_auth:texts.title')}
			</Typography>
			<Typography variant='small' color='muted'>
				{t('ns_auth:texts.description')}
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

export default {
	Container,
	FormSection,
	FormHeading,
	FormFieldset,
	HomeNavigator,
	LanguageSelector,
	ThemeSelector
}
