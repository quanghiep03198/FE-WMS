import { Theme } from '@/common/constants/enums'
import useTheme from '@/common/hooks/use-theme'
import { Button, Icon, Tooltip, TooltipProps } from '@/components/ui'
import { useKeyPress } from 'ahooks'
import React from 'react'
import { useTranslation } from 'react-i18next'

const ThemeToggle: React.FC<
	React.ComponentProps<typeof Button.prototype> & { tooltipProps: Partial<TooltipProps> }
> = ({ variant = 'ghost', tooltipProps }) => {
	const { theme, setTheme } = useTheme()
	const darkTheme = theme === Theme.DARK
	const { t } = useTranslation()
	const toggleTheme = () => setTheme(darkTheme ? Theme.LIGHT : Theme.DARK)

	useKeyPress('ctrl.alt.t', (e) => {
		e.preventDefault()
		toggleTheme()
	})

	return (
		<Tooltip message={t('ns_common:actions.toggle_theme')} triggerProps={{ asChild: true }} {...tooltipProps}>
			<Button
				variant={variant}
				size='icon'
				className='relative'
				aria-pressed={darkTheme}
				onClick={() => toggleTheme()}>
				<Icon
					aria-label={darkTheme ? 'Dark Mode' : 'Light Mode'}
					name={darkTheme ? 'Moon' : 'Sun'}
					className={
						darkTheme
							? 'animate-[rotate-in-reverse_0.25s_ease-out_forwards]'
							: 'animate-[rotate-in_0.25s_ease-out_forwards]'
					}
				/>
			</Button>
		</Tooltip>
	)
}

export default ThemeToggle
