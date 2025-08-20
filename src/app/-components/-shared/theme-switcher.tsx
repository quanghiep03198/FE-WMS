import { Monitor, Moon, Sun } from 'lucide-react'

import { Theme } from '@/common/constants/enums'
import useTheme from '@/common/hooks/use-theme'
import { cn } from '@/common/utils/cn'
import { Div } from '@/components/ui'
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

	return (
		<div className={cn('relative isolate flex h-8 rounded-full bg-background p-1 ring-1 ring-border', className)}>
			{themes.map(({ key, icon: Icon, label }) => {
				const isActive = theme === key
				return (
					<button
						aria-label={label}
						className='relative h-6 w-6 rounded-full'
						key={key}
						onClick={() => setTheme(key as Theme)}
						type='button'>
						{isActive && (
							<Div
								className={cn('absolute inset-0 rounded-full bg-secondary transition-all duration-500', {
									'right-0': theme === Theme.DARK,
									'left-1/2 -translate-x-1/2': theme === Theme.LIGHT,
									'left-0': theme === Theme.SYSTEM
								})}
							/>
						)}
						<Icon
							className={cn(
								'relative z-10 m-auto h-4 w-4',
								isActive ? 'text-foreground' : 'text-muted-foreground'
							)}
						/>
					</button>
				)
			})}
		</div>
	)
}
