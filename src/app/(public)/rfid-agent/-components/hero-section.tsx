import { cn } from '@/common/utils/cn'
import { Badge, buttonVariants, Div, Icon, Typography } from '@/components/ui'
import { Link } from '@tanstack/react-router'

const GridDotBackground: React.FC = () => {
	return (
		<Div className='absolute left-1/2 top-1/2 z-[-2] mx-auto h-[50vh] w-full max-w-[40vw] -translate-x-1/2 -translate-y-1/2 skew-y-[24deg]'>
			<Div className='pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-background text-foreground [mask-image:radial-gradient(circle_at_center,transparent_10%,black)]' />
			<Div
				className={cn(
					'absolute inset-0',
					'[background-size:40px_40px]',
					'[background-image:linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)]'
				)}
			/>
		</Div>
	)
}

const Hero: React.FC = () => {
	return (
		<Div
			as='section'
			className='min-h-[90vh] place-content-center place-items-center p-2 @container/hero lg:p-6 xl:p-6'>
			<Div className='relative mx-auto flex max-w-5xl flex-col items-center justify-center gap-y-6 py-10 *:text-pretty *:text-center @7xl:items-start @7xl:text-left md:items-center md:text-center'>
				<GridDotBackground />
				<Badge variant='secondary' className='gap-x-2 self-center px-3 py-1 text-sm'>
					Just released version 1.0.0
				</Badge>
				<Typography variant='h1' className='xl:text-6xl'>
					Empower your Inventory by <br className='hidden xl:inline-block' /> Real-time RFID Reader connectivity
					with{' '}
					<span className='animate-[shimmer_3s_linear_infinite_both] bg-[linear-gradient(75deg,hsl(var(--foreground)),45%,hsl(var(--muted-foreground)),50%,hsl(var(--foreground)))] bg-[length:200%_100%] bg-clip-text text-transparent dark:bg-[linear-gradient(75deg,hsl(var(--muted-foreground)),45%,hsl(var(--foreground)),50%,hsl(var(--muted-foreground)))]'>
						RFID Agent
					</span>
				</Typography>
				<Typography className='text-lg sm:text-sm md:text-base xl:text-xl'>
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

export default Hero
