import { Theme } from '@/common/constants/enums'
import useTheme from '@/common/hooks/use-theme'
import { cn } from '@/common/utils/cn'
import { Button, Icon, buttonVariants } from '@/components/ui'
import { useKeyPress } from 'ahooks'
import { VariantProps } from 'class-variance-authority'
import { ClassProp } from 'class-variance-authority/types'
import { memo, useMemo } from 'react'

type ThemeToggleProps = VariantProps<typeof buttonVariants> & ClassProp

const ThemeToggle: React.FC<ThemeToggleProps> = ({ variant = 'ghost', className, ...props }) => {
	const { theme, setTheme } = useTheme()
	const darkTheme = useMemo<boolean>(() => theme === Theme.DARK, [theme])
	const toggleTheme = () => (darkTheme ? setTheme(Theme.LIGHT) : setTheme(Theme.DARK))

	useKeyPress('ctrl.alt.t', (e) => {
		e.preventDefault()
		toggleTheme()
	})

	return (
		<Button onClick={toggleTheme} className='relative' variant={variant} {...props}>
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
		</Button>
	)
}

export default memo(ThemeToggle)
