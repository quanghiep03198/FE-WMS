import { Div, Icon, Typography } from '@/components/ui'
import { Link } from '@tanstack/react-router'
import { RFID_AGENT_VERSION } from '../rfid-agent/-constants'

export function ExploreRFIDAgentBanner() {
	return (
		<Div className='sticky top-0 z-50 h-10 bg-primary p-2 text-primary-foreground shadow-lg duration-500 animate-in fade-in-20 slide-in-from-top-full'>
			<Div className='mx-auto flex max-w-7xl items-center justify-center xxl:max-w-8xl'>
				<Typography className='inline-flex items-center gap-x-2'>
					<Typography as='span'>🚀 RFID Agent version {RFID_AGENT_VERSION} has been released !!!</Typography>
					<Link
						to='/rfid-agent'
						className='relative inline-flex items-center gap-x-1.5 text-base underline-offset-4 hover:underline'>
						Explore now <Icon name='ArrowRight' size={14} strokeWidth={2} className='translate-y-0.5' />
					</Link>
				</Typography>
			</Div>
		</Div>
	)
}
