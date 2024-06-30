import { Theme } from '@/common/constants/enums'
import useTheme from '@/common/hooks/use-theme'
import { cn } from '@/common/utils/cn'
import { Button, Div, Icon, Tooltip } from '@/components/ui'
import { useKeyPress } from 'ahooks'
import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

const ThemeToggle: React.FC<React.ComponentProps<typeof Button.prototype>> = ({ variant = 'ghost' }) => {
	const { theme, setTheme } = useTheme()
	const darkTheme = useMemo<boolean>(() => theme === Theme.DARK, [theme])
	const { t } = useTranslation()
	const toggleTheme = () => (darkTheme ? setTheme(Theme.LIGHT) : setTheme(Theme.DARK))

	useKeyPress('ctrl.alt.t', (e) => {
		e.preventDefault()
		toggleTheme()
	})

	return (
		<Tooltip message={t('ns_common:actions.toggle_theme')} triggerProps={{ asChild: true }}>
			<Button
				role='button'
				variant={variant}
				size='icon'
				aria-pressed={darkTheme}
				onClick={() => toggleTheme()}
				className='relative'>
				<Icon
					aria-label='light'
					name='Sun'
					className={cn(
						'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ease-in-out',
						!darkTheme ? 'rotate-0 opacity-100' : '-rotate-45 opacity-0'
					)}
				/>
				<Icon
					aria-label='dark'
					name='Moon'
					className={cn(
						'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ease-in-out',
						darkTheme ? 'rotate-0 opacity-100' : 'rotate-45 opacity-0'
					)}
				/>
			</Button>
		</Tooltip>
	)
}

export default memo(ThemeToggle)
