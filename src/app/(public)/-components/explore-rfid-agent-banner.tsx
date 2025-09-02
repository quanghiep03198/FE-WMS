import { Div, Icon, Typography } from '@/components/ui'
import { Link } from '@tanstack/react-router'

export function ExploreRFIDAgentBanner() {
	return (
		<Div className='sticky top-0 z-50 h-10 bg-primary p-2 text-primary-foreground shadow-md'>
			<Div className='mx-auto flex max-w-7xl items-center justify-center xxl:max-w-8xl'>
				<Typography className='inline-flex items-center gap-x-2'>
					<Typography as='span' className='inline-flex items-center gap-x-2'>
						🚀 RFID Agent version 1.0.0 is finally out !!!
					</Typography>
					<Link
						to='/explore/rfid-agent'
						className='relative inline-flex items-center gap-x-1.5 text-base font-medium text-blue-400 underline-offset-8 hover:underline dark:text-blue-500'>
						Explore now <Icon name='ArrowRight' size={14} strokeWidth={2} className='translate-y-0.5' />
					</Link>
				</Typography>
			</Div>
		</Div>
	)
}
