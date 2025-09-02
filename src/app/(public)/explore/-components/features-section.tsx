import { Div, Icon, Typography } from '@/components/ui'
import RealtimeVisual from './realtime-visual'

const IntroductionSection = () => {
	return (
		<Div as='section' className='mx-auto max-w-7xl px-2 py-20 xxl:max-w-8xl'>
			<Div className='flex flex-col'>
				<Typography variant='small' className='mb-3 font-medium text-success'>
					What is RFID Agent?
				</Typography>
				<Typography variant='h1' className='mb-6 max-w-4xl !font-medium'>
					<strong className='font-bold'>RFID Agent</strong> is a lightweight desktop application that connects your
					UHF reader to our web application
				</Typography>
				<Div className='mb-10 mt-6 grid grid-cols-4 gap-6 [&_svg]:stroke-success'>
					<Div className='space-y-2'>
						<Div className='!mb-6 size-14 place-content-center place-items-center rounded-md border bg-card'>
							<Icon name='Zap' size={24} />
						</Div>
						<Typography variant='h4' className='font-medium'>
							Real-time
						</Typography>
						<Typography className='text-muted-foreground'>
							Instantly see RFID data in our web application as it&apos;s read by your UHF reader.
						</Typography>
					</Div>
					<Div className='space-y-3'>
						<Div className='!mb-6 size-14 place-content-center place-items-center rounded-md border bg-card'>
							<Icon name='FileCog' size={24} />
						</Div>
						<Typography variant='h4' className='font-medium'>
							Simple installation
						</Typography>
						<Typography className='text-muted-foreground'>
							Easy-to-follow installation guide to get you up and running in no time. No technical expertise
							required.
						</Typography>
					</Div>
					<Div className='space-y-3'>
						<Div className='!mb-6 size-14 place-content-center place-items-center rounded-md border bg-card'>
							<Icon name='FileStack' size={24} />
						</Div>
						<Typography variant='h4' className='font-medium'>
							Lighweight
						</Typography>
						<Typography className='text-muted-foreground'>
							Minimal resource usage ensures your system remains fast and responsive while RFID Agent is running.
						</Typography>
					</Div>
					<Div className='space-y-3'>
						<Div className='!mb-6 size-14 place-content-center place-items-center rounded-md border bg-card'>
							<Icon name='Handshake' size={24} />
						</Div>
						<Typography variant='h4' className='font-medium'>
							Long-term support
						</Typography>
						<Typography className='text-muted-foreground'>
							Regular updates and improvements to ensure compatibility with the latest UHF readers and web
						</Typography>
					</Div>
				</Div>
				<Div>
					<RealtimeVisual />
				</Div>
			</Div>
		</Div>
	)
}

export default IntroductionSection
