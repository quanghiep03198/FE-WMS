import { Theme } from '@common/constants/enums'
import { cn } from '@common/utils/cn'
import useTheme from '@hooks/use-theme'
import { useKeyPress } from 'ahooks'
import { Monitor, Moon, Sun } from 'lucide-react'
import { useRef } from 'react'

const themes = [
	{
		key: Theme.SYSTEM,
		icon: Monitor,
		label: 'System theme'
	},
	{
		key: Theme.LIGHT,
		icon: Sun,
		label: 'Light theme'
	},
	{
		key: Theme.DARK,
		icon: Moon,
		label: 'Dark theme'
	}
]
export type ThemeSwitcherProps = {
	value?: Theme
	onChange?: (theme: Theme) => void
	defaultValue?: Theme
	className?: string
}
export const ThemeSwitcher = ({ className }: ThemeSwitcherProps) => {
	const { theme, setTheme } = useTheme()
	const activeRef = useRef<HTMLDivElement>(null)
	const firstButtonRef = useRef<HTMLButtonElement | null>(null)
	const toggleTheme = () => setTheme(theme === Theme.DARK ? Theme.LIGHT : Theme.DARK)

	useKeyPress('ctrl.alt.t', (e) => {
		e.preventDefault()
		toggleTheme()
	})

	const handleSelectTheme = (theme: Theme) => {
		setTheme(theme)
		requestAnimationFrame(() => {
			activeRef.current.style.transform = (() => {
				switch (theme) {
					case Theme.SYSTEM:
						return `translateX(0px)`
					case Theme.LIGHT:
						return `translateX(${firstButtonRef.current.offsetWidth}px)`
					case Theme.DARK:
						return `translateX(${firstButtonRef.current.offsetWidth * 2}px)`
					default:
						return `translateX(0px)`
				}
			})()
		})
	}

	return (
		<div
			className={cn(
				'bg-background ring-border relative isolate grid h-8 grid-cols-3 rounded-full p-1 ring-1',
				className
			)}>
			<div className='absolute inset-x-1 top-1/2 z-[-1] w-full -translate-y-1/2'>
				<div
					ref={activeRef}
					className='bg-accent aspect-square size-6 rounded-full transition-all duration-200 ease-in-out'
				/>
			</div>
			{themes.map(({ key, icon: Icon, label }) => {
				const isActive = theme === key
				return (
					<button
						aria-label={label}
						ref={(e) => {
							if (key === Theme.SYSTEM) firstButtonRef.current = e
						}}
						className='first relative h-6 w-6 rounded-full'
						key={key}
						onClick={() => handleSelectTheme(key as Theme)}
						type='button'>
						<Icon
							className={cn(
								'relative z-10 m-auto size-4',
								isActive ? 'text-foreground' : 'text-muted-foreground'
							)}
						/>
					</button>
				)
			})}
		</div>
	)
}
