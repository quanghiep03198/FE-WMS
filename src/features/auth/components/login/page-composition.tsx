import { cn } from '@common/utils/cn'
import { LanguageSelect } from '@components/shared/language-selector'
import ThemeToggle from '@components/shared/theme-toggle'
import { Div, Icon, Label, Tooltip, Typography, buttonVariants } from '@components/ui'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import LoginForm from './login-form'

const Container = tw.div`relative flex justify-center items-center min-h-screen overflow-y-auto text-foreground scrollbar-none scrollbar`
// const FormSection = tw.section`bg-background flex w-full flex-col items-stretch justify-center max-w-lg mx-auto gap-y-6 p-6 sm:px-2 z-10`

const ThemeSelector: React.FC = () => {
	return (
		<Div className='fixed top-2 right-2 z-50'>
			<ThemeToggle tooltipProps={{ contentProps: { side: 'left' } }} />
		</Div>
	)
}

const HomeNavigator: React.FC = () => {
	return (
		<Div className='fixed! top-2 left-2 z-10'>
			<Tooltip message='Home' contentProps={{ side: 'right' }}>
				<Link to='/' className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}>
					<Icon name='ArrowLeft' />
				</Link>
			</Tooltip>
		</Div>
	)
}

const FormFieldset: React.FC = () => {
	return <LoginForm />
}

const FormHeading: React.FC = () => {
	const { t } = useTranslation()

	return (
		<Div className='w-full space-y-2 text-center *:text-pretty'>
			<Typography variant='h3' className='text-center whitespace-nowrap'>
				{t('ns_auth:texts.title')}
			</Typography>
			<Typography color='muted'>{t('ns_auth:texts.description')}</Typography>
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

export { Container, FormFieldset, FormHeading, HomeNavigator, LanguageSelector, ThemeSelector }
