import type { Theme } from '@/common/constants/enums'
import { Div, Label, RadioGroup, RadioGroupItem, Typography } from '@/components/ui'
import useTheme from '@/hooks/use-theme'
import React from 'react'

const ThemeRadioGroup: React.FC = () => {
	const { theme, setTheme } = useTheme()

	return (
		<RadioGroup
			onValueChange={(value) => {
				setTheme(value as Theme)
			}}
			defaultValue={theme}
			className='grid max-w-md grid-cols-2 gap-8 pt-2'>
			<Label className='[&:has([data-state=checked])>Div]:border-primary'>
				<RadioGroupItem value='light' className='sr-only' />
				<Div className='items-center rounded-md border-2 border-muted p-1 hover:border-accent'>
					<Div className='space-y-2 rounded-sm bg-neutral-200 p-2'>
						<Div className='space-y-2 rounded-md bg-white p-2 shadow-sm'>
							<Div className='h-2 w-[80px] rounded-lg bg-neutral-200' />
							<Div className='h-2 w-[100px] rounded-lg bg-neutral-200' />
						</Div>
						<Div className='flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm'>
							<Div className='h-4 w-4 rounded-full bg-neutral-200' />
							<Div className='h-2 w-[100px] rounded-lg bg-neutral-200' />
						</Div>
						<Div className='flex items-center space-x-2 rounded-md bg-white p-2 shadow-sm'>
							<Div className='h-4 w-4 rounded-full bg-neutral-200' />
							<Div className='h-2 w-[100px] rounded-lg bg-neutral-200' />
						</Div>
					</Div>
				</Div>
				<Typography className='block w-full p-2 text-center font-normal'>Light</Typography>
			</Label>

			<Label className='[&:has([data-state=checked])>Div]:border-primary'>
				<RadioGroupItem value='dark' className='sr-only' />
				<Div className='items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground'>
					<Div className='space-y-2 rounded-sm bg-neutral-950 p-2'>
						<Div className='space-y-2 rounded-md bg-neutral-800 p-2 shadow-sm'>
							<Div className='h-2 w-[80px] rounded-lg bg-neutral-400' />
							<Div className='h-2 w-[100px] rounded-lg bg-neutral-400' />
						</Div>
						<Div className='flex items-center space-x-2 rounded-md bg-neutral-800 p-2 shadow-sm'>
							<Div className='h-4 w-4 rounded-full bg-neutral-400' />
							<Div className='h-2 w-[100px] rounded-lg bg-neutral-400' />
						</Div>
						<Div className='flex items-center space-x-2 rounded-md bg-neutral-800 p-2 shadow-sm'>
							<Div className='h-4 w-4 rounded-full bg-neutral-400' />
							<Div className='h-2 w-[100px] rounded-lg bg-neutral-400' />
						</Div>
					</Div>
				</Div>
				<Typography className='block w-full p-2 text-center font-normal'>Dark</Typography>
			</Label>
		</RadioGroup>
	)
}

ThemeRadioGroup.displayName = 'ThemeRadioGroup'

export default ThemeRadioGroup
