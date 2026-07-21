import { buttonVariants, Div, Icon, Typography } from '@/components/ui'
import { cn } from '@common/utils/cn'
import { Link } from '@tanstack/react-router'
import tw from 'tailwind-styled-components'
import { RFID_AGENT_VERSION } from '../-constants'

const GridDotBackground: React.FC = () => {
	return (
		<Div className='xxl:scale-110 absolute top-1/2 left-1/2 z-0 mx-auto h-[50vh] w-full max-w-[45vw] -translate-x-1/2 -translate-y-1/2 scale-110 skew-y-18 transition-transform duration-500 ease-in-out'>
			<Div className='bg-background text-foreground pointer-events-none absolute inset-0 z-10 flex items-center justify-center mask-[radial-gradient(circle_at_center,transparent_10%,black)]' />
			<Div
				className={cn(
					'absolute inset-0',
					'bg-size-[40px_40px]',
					'bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)]'
				)}
			/>
		</Div>
	)
}

const Hero: React.FC = () => {
	return (
		<Div
			as='section'
			className='@container/hero relative min-h-[90vh] place-content-center place-items-center p-2 lg:p-6 xl:p-6'>
			<GridDotBackground />
			<Div className='group/hero relative mx-auto flex max-w-5xl flex-col items-center justify-center gap-y-6 py-10 *:text-center *:text-pretty md:items-center md:text-center @7xl:items-start @7xl:text-left'>
				<GradientBadge>
					<span className='relative z-20'>Just released version {RFID_AGENT_VERSION}</span>
				</GradientBadge>
				<Typography variant='h1' className='xxl:text-6xl xl:text-5xl'>
					Empower your Inventory by <br className='hidden xl:inline-block' /> Real-time RFID Reader connectivity
					with{' '}
					<span className='animate-[shimmer_3s_linear_infinite_both] bg-[linear-gradient(75deg,var(--foreground),45%,var(--muted-foreground),50%,var(--foreground))] bg-size-[200%_100%] bg-clip-text text-transparent dark:bg-[linear-gradient(75deg,var(--muted-foreground),45%,var(--foreground),50%,var(--muted-foreground))]'>
						RFID Agent
					</span>
				</Typography>
				<Typography className='xxl:text-xl text-lg sm:text-sm md:text-base'>
					A lightweight desktop application that connects your UHF RFID reader to our Web-application for seamless,
					real-time inventory management. Experience effortless setup, minimal resource usage, and long-term
					support.
				</Typography>
				<Link
					hash='features'
					className={cn(buttonVariants({ variant: 'default', size: 'lg', className: 'mt-6 self-center' }))}>
					Explore features <Icon name='ArrowDown' className='animate-bounce' />
				</Link>
			</Div>
		</Div>
	)
}

const GradientBadge = tw.div`
	relative h-8 self-center px-3 py-1.5 font-medium rounded-md text-sm shadow-md

	before:absolute 
	before:inset-0 
	before:z-0 
	before:rounded-md
	before:-translate-y-px 
	before:bg-[conic-gradient(from_100deg_at_50%_50%,var(--accent)_90deg,var(--accent)_180deg,#00adef_270deg,var(--accent)_0.95turn)] 
	before:content-[""]
	
	after:absolute 
	after:inset-0 
	after:left-1/2 
	after:top-1/2 
	after:z-10 
	after:h-[calc(100%-1.5px)] 
	after:w-[calc(100%-2px)] 
	after:-translate-x-1/2 
	after:-translate-y-[calc(50%+1px)]
	after:rounded-md 
	after:bg-background 
`

export default Hero
