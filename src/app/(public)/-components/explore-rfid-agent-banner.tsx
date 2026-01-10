import { Div, Icon, Typography } from '@/components/ui'
import { Link } from '@tanstack/react-router'
import { useGetLatestRelease } from '../rfid-agent/-hooks/use-get-latest-release'

export function ExploreRFIDAgentBanner() {
	const { latestRelease } = useGetLatestRelease()

	return (
		<Div
			className={
				'sticky top-0 z-50 bg-primary p-2 text-primary-foreground shadow-lg duration-500 animate-in fade-in-20 slide-in-from-top-full sm:h-20 md:h-10 lg:h-10 xl:h-10'
			}>
			<Div className='mx-auto flex h-full max-w-7xl items-center justify-center xxl:max-w-8xl'>
				<Typography className='inline-flex flex-wrap items-center gap-x-2 sm:flex-col'>
					<Typography as='span'>
						🚀 RFID Agent {!!latestRelease && latestRelease?.tag_name} has been released !!!
					</Typography>
					<Link
						to='/rfid-agent'
						className='relative inline-flex items-center gap-x-1 text-base text-success underline-offset-4 hover:underline'>
						Explore now <Icon name='ArrowRight' size={14} strokeWidth={2} className='translate-y-0.5' />
					</Link>
				</Typography>
			</Div>
		</Div>
	)
}
