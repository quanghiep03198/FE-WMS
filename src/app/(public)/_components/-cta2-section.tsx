import { Div, Icon, Typography } from '@/components/ui'
import DeploymentGlobe from './-deployment-globe'

const CTA2Section: React.FC = () => {
	return (
		<Div>
			<Div className='grid grid-cols-1 items-center gap-10 lg:grid-cols-2 xl:grid-cols-2 xxl:grid-cols-[1fr_1.5fr]'>
				<Div className='flex flex-col gap-y-6 sm:gap-y-3 sm:text-center'>
					<Typography variant='small' className='font-jetbrains'>
						EDGE DEPLOYMENT
					</Typography>
					<Typography variant='h3' className='text-pretty sm:text-lg'>
						High Availability at our factories across Asia
					</Typography>
					<Typography className='leading-relaxed tracking-wide sm:text-sm'>
						Our app is designed to provide exceptional reliability and performance at factories throughout Asia.
						Ensure seamless operations and robust connectivity where it’s needed most—empower your facilities
						today
					</Typography>
				</Div>
				<Div className='relative flex justify-end'>
					<DeploymentGlobe />
				</Div>
			</Div>
			<Div className='grid w-full grid-cols-4 gap-6 sm:grid-cols-1 md:grid-cols-2 xl:-translate-y-1/4'>
				<Div className='flex flex-col gap-x-4 gap-y-2 sm:flex-row [&>:first-child]:basis-1/6'>
					<Div className='grid aspect-square size-12 place-content-center rounded-md bg-accent'>
						<Icon name='Rocket' size={24} strokeWidth={1.5} />
					</Div>
					<Div className='space-y-2'>
						<Typography className='font-semibold'>Automatically Deployment</Typography>
						<Typography variant='small' color='muted'>
							Our applications are automatically deployed, delivering the latest updates quickly while ensuring
							minimal downtime and optimal efficiency.
						</Typography>
					</Div>
				</Div>
				<Div className='flex flex-col gap-x-4 gap-y-2 sm:flex-row [&>:first-child]:basis-1/6'>
					<Div className='grid aspect-square size-12 place-content-center rounded-md bg-accent sm:col-span-1'>
						<Icon name='CloudCog' size={24} strokeWidth={1.5} />
					</Div>
					<Div className='space-y-2'>
						<Typography className='font-semibold sm:col-span-5'>Fully managed</Typography>
						<Typography variant='small' color='muted'>
							Experience the convenience of a fully managed service, allowing you to focus on your core business
							while we handle the infrastructure.
						</Typography>
					</Div>
				</Div>
				<Div className='flex flex-col gap-x-4 gap-y-2 sm:flex-row [&>:first-child]:basis-1/6'>
					<Div className='grid aspect-square size-12 place-content-center rounded-md bg-accent sm:col-span-1'>
						<Icon name='Blocks' size={24} strokeWidth={1.5} />
					</Div>
					<Div className='space-y-2'>
						<Typography className='font-semibold sm:col-span-5'>Mornitoring</Typography>
						<Typography variant='small' color='muted'>
							Monitor your applications in real-time with PM2, allowing you to control and manage your
							deployments remotely with ease.
						</Typography>
					</Div>
				</Div>
				<Div className='flex flex-col gap-x-4 gap-y-2 sm:flex-row [&>:first-child]:basis-1/6'>
					<Div className='grid aspect-square size-12 place-content-center rounded-md bg-accent'>
						<Icon name='Server' size={24} strokeWidth={1.5} />
					</Div>
					<Div className='space-y-2'>
						<Typography className='font-semibold sm:col-span-5'>Server & Backup</Typography>
						<Typography variant='small' color='muted'>
							Secure your data with reliable servers and automated backups. Minimize downtime, protect critical
							information, and ensure seamless operations with scalable solutions tailored to our business.
						</Typography>
					</Div>
				</Div>
			</Div>
		</Div>
	)
}

export default CTA2Section
