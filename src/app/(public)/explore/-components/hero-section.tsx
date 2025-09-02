import { cn } from '@/common/utils/cn'
import { Badge, Button, Div, Icon, Typography } from '@/components/ui'
import Spotlight from '../../-components/spotlight'
import MQTTVisual from './mqtt-visual'
import RealtimeVisual from './realtime-visual'
import StorageVisual from './storage-visual'

const GridDotBackground: React.FC = () => {
	return (
		<Div className='absolute left-10 top-1/2 z-[-2] mx-auto h-[50vh] w-[40vw] max-w-3xl -translate-y-1/2 -skew-y-[24deg]'>
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

const RFIDAgentHero: React.FC = () => {
	return (
		<Div as='section' className='relative min-h-[95vh] place-content-center place-items-center'>
			<Spotlight fill='white' className='-left-20 -top-10 z-[-1] xl:-top-40' />
			<GridDotBackground />
			<Div className='mx-auto grid max-w-8xl grid-cols-[1fr_1.25fr] gap-20'>
				<Div className='flex max-w-4xl flex-col justify-center gap-y-6 *:text-pretty'>
					<Badge className='gap-x-2 self-start px-2 py-1'>
						<Icon name='Rocket' /> Just realeased v1.0.0
					</Badge>
					<Typography variant='h1'>
						Empower your Inventory by Real-time UHF Reader connectivity with{' '}
						<span className='animate-[shimmer_3s_linear_infinite_both] bg-[linear-gradient(75deg,hsl(var(--foreground)),45%,hsl(var(--muted-foreground)),50%,hsl(var(--foreground)))] bg-[length:200%_100%] bg-clip-text text-transparent dark:bg-[linear-gradient(75deg,hsl(var(--muted-foreground)),45%,hsl(var(--foreground)),50%,hsl(var(--muted-foreground)))]'>
							RFID Agent
						</span>
					</Typography>
					<Typography className='text-lg'>
						A lightweight desktop application that connects your UHF RFID reader to our Web-application for
						seamless, real-time inventory management. Experience effortless setup, minimal resource usage, and
						long-term support.
					</Typography>
					<Div className='mt-6 flex items-center gap-x-2'>
						<Button>Get started</Button>
						<Button variant='ghost'>Learn more</Button>
					</Div>
				</Div>
				<Div className='grid grid-cols-2 grid-rows-3 gap-4'>
					<RealtimeVisual />
					<MQTTVisual />
					<StorageVisual />
				</Div>
			</Div>
		</Div>
	)
}

export default RFIDAgentHero
