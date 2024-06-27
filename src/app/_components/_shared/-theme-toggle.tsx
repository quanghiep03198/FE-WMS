import { Theme } from '@/common/constants/enums'
import useTheme from '@/common/hooks/use-theme'
import { cn } from '@/common/utils/cn'
import { Div, Icon } from '@/components/ui'
import { useKeyPress } from 'ahooks'
import React, { memo, useMemo } from 'react'

const ThemeToggle: React.FC<React.ComponentProps<'div'>> = (props) => {
	const { theme, setTheme } = useTheme()
	const darkTheme = useMemo<boolean>(() => theme === Theme.DARK, [theme])
	const toggleTheme = () => (darkTheme ? setTheme(Theme.LIGHT) : setTheme(Theme.DARK))

	useKeyPress('ctrl.alt.t', (e) => {
		e.preventDefault()
		toggleTheme()
	})

	return (
		<Div
			role='button'
			aria-label='Toggle theme'
			aria-pressed={darkTheme}
			onClick={toggleTheme}
			className='relative h-full w-full'
			{...props}>
			<Icon
				name='Sun'
				className={cn(
					'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ease-in-out',
					!darkTheme ? 'rotate-0 opacity-100' : '-rotate-45 opacity-0'
				)}
			/>
			<Icon
				name='Moon'
				className={cn(
					'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-300 ease-in-out',
					darkTheme ? 'rotate-0 opacity-100' : 'rotate-45 opacity-0'
				)}
			/>
		</Div>
	)
}

export default memo(ThemeToggle)
