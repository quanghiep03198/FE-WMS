import { Theme } from '@/common/constants/enums'
import useTheme from '@/common/hooks/use-theme'
import type { TooltipProps } from '@/components/ui'
import { Button, Icon, Tooltip } from '@/components/ui'
import { useKeyPress, useUpdateEffect } from 'ahooks'
import React, { useRef } from 'react'
import { useTranslation } from 'react-i18next'

const ThemeToggle: React.FC<
	React.ComponentProps<typeof Button.prototype> & { tooltipProps: Partial<TooltipProps> }
> = ({ variant = 'ghost', tooltipProps }) => {
	const { theme, setTheme } = useTheme()
	const iconRef = useRef<SVGSVGElement>(null)
	const darkTheme = theme === Theme.DARK
	const { t } = useTranslation()
	const toggleTheme = () => setTheme(darkTheme ? Theme.LIGHT : Theme.DARK)

	useKeyPress('ctrl.alt.t', (e) => {
		e.preventDefault()
		toggleTheme()
	})

	useUpdateEffect(() => {
		if (iconRef.current) {
			iconRef.current.classList.value = ''
			if (theme === Theme.DARK) iconRef.current.classList.add('animate-[rotate-in-reverse_0.25s_ease-out_forwards]')
			else iconRef.current.classList.add('animate-[rotate-in_0.25s_ease-out_forwards]')
		}
	}, [iconRef, theme])

	return (
		<Tooltip message={t('ns_common:actions.toggle_theme')} triggerProps={{ asChild: true }} {...tooltipProps}>
			<Button
				variant={variant}
				size='icon'
				className='relative'
				aria-pressed={darkTheme}
				onClick={() => toggleTheme()}>
				<Icon aria-label={darkTheme ? 'Dark Mode' : 'Light Mode'} name={darkTheme ? 'Moon' : 'Sun'} ref={iconRef} />
			</Button>
		</Tooltip>
	)
}

export default ThemeToggle
