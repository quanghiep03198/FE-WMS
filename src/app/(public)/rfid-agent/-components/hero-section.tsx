import { cn } from '@/common/utils/cn'
import { Badge, Button, Div, Icon, Typography } from '@/components/ui'
import MQTTVisualCard from './mqtt-visual-card'
import RealtimeVisualCard from './realtime-visual-card'
import StorageVisual from './storage-visual-card'

const GridDotBackground: React.FC = () => {
	return (
		<Div className='absolute left-1/2 top-1/2 z-[-2] mx-auto h-80 w-full max-w-96 -translate-x-1/2 -translate-y-1/2 skew-y-[24deg]'>
			<Div className='pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-background text-foreground [mask-image:radial-gradient(circle_at_center,transparent_10%,black)]' />
			<Div
				className={cn(
					'absolute inset-0',
					'[background-size:40px_40px]',
					'[background-image:linear-gradient(to_right,hsl(var(--muted-foreground)/30%)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--muted-foreground)/30%)_1px,transparent_1px)]'
				)}
			/>
		</Div>
	)
}

const Hero: React.FC = () => {
	return (
		<Div
			as='section'
			className='min-h-[85vh] place-content-center place-items-center p-2 @container/hero lg:p-6 xl:p-6'>
			<Div className='mx-auto grid max-w-8xl grid-cols-1 gap-20 @7xl:grid-cols-[1fr_1.25fr]'>
				<Div className='relative flex max-w-4xl flex-col items-center justify-center gap-y-6 py-10 text-center *:text-pretty @7xl:items-start @7xl:text-left md:items-center md:text-center'>
					<GridDotBackground />
					<Badge className='gap-x-2 self-center px-2 py-1 @7xl:self-start'>
						<Icon name='Rocket' /> Just realeased v1.0.0
					</Badge>
					<Typography variant='h1'>
						Empower your Inventory by Real-time UHF Reader connectivity with{' '}
						<span className='animate-[shimmer_3s_linear_infinite_both] bg-[linear-gradient(75deg,hsl(var(--foreground)),45%,hsl(var(--muted-foreground)),50%,hsl(var(--foreground)))] bg-[length:200%_100%] bg-clip-text text-transparent dark:bg-[linear-gradient(75deg,hsl(var(--muted-foreground)),45%,hsl(var(--foreground)),50%,hsl(var(--muted-foreground)))]'>
							RFID Agent
						</span>
					</Typography>
					<Typography className='text-lg sm:text-sm md:text-base'>
						A lightweight desktop application that connects your UHF RFID reader to our Web-application for
						seamless, real-time inventory management. Experience effortless setup, minimal resource usage, and
						long-term support.
					</Typography>
					<Div className='mt-6 flex items-center justify-center @7xl:justify-start'>
						<Button>Get started</Button>
						<Button variant='ghost'>Learn more</Button>
					</Div>
				</Div>
				<Div className='grid grid-cols-2 grid-rows-3 gap-4 @container/visual sm:grid-cols-1 sm:grid-rows-[auto_auto_auto]'>
					<RealtimeVisualCard />
					<MQTTVisualCard />
					<StorageVisual />
				</Div>
			</Div>
		</Div>
	)
}

export default Hero
