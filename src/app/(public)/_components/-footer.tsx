import { Button, Div, Icon, Input, Label, Typography } from '@/components/ui'
import { Separator } from '@radix-ui/react-context-menu'
import tw from 'tailwind-styled-components'

const Footer: React.FC = () => {
	return (
		<Div as='footer' className='border-t bg-background/90 bg-opacity-90 px-6 mix-blend-screen'>
			{/* <Separator className='mx-auto h-px max-w-7xl rounded-full bg-success [mask-image:linear-gradient(90deg,transparent,white_50%,white_50%,transparent)]' /> */}
			<Div className='mx-auto max-w-7xl divide-y xxl:max-w-8xl'>
				<Div className='flex flex-wrap items-start gap-y-10 py-12'>
					<Div className='basis-1/5 space-y-4 sm:basis-full md:basis-1/3'>
						<Typography className='text-lg font-semibold'>Solutions</Typography>
						<ul className='space-y-2'>
							<li>Analytics</li>
							<li>Automation</li>
							<li>RFID</li>
							<li>Insight</li>
						</ul>
					</Div>
					<Div className='basis-1/5 space-y-4 sm:basis-full md:basis-1/3'>
						<Typography className='text-lg font-semibold'>Support</Typography>
						<ul className='space-y-2'>
							<li>Technical</li>
							<li>Report bug</li>
							<li>Connection</li>
							<li>Accessibility</li>
						</ul>
					</Div>
					<Div className='basis-1/5 space-y-4 sm:basis-full md:basis-1/3'>
						<Typography className='text-lg font-semibold'>Legal</Typography>
						<ul className='space-y-2'>
							<li>Terms of service</li>
							<li>Privacy policy</li>
							<li>License</li>
						</ul>
					</Div>
					<Separator className='hidden sm:block' />
					<Div className='basis-2/5 space-y-2 sm:basis-full md:basis-full'>
						<Label htmlFor='subscribe' className='text-lg'>
							Subscribe to our updates
						</Label>
						<Typography variant='small' color='muted' className='!mb-6 w-full max-w-96'>
							The latest updates, release, and resources from developer team, sent to your inbox weekly.
						</Typography>
						<form className='flex items-center gap-x-2'>
							<Input placeholder='Enter your email' className='w-full max-w-80' />
							<Button>Subscribe</Button>
						</form>
					</Div>
				</Div>

				<Div className='flex justify-between gap-6 py-6 sm:flex-col sm:items-center'>
					<Typography variant='small'>
						© {new Date().getFullYear()} GreenLand, Inc. All rights reserved.
					</Typography>
					<Div className='flex items-center gap-x-3'>
						<Typography className='font-medium' variant='small'>
							Powered by
						</Typography>
						<Div className='inline-flex items-center gap-x-1'>
							<Image src='/react.svg' alt='React' className='drop-shadow-[0px_0px_4px_#00d8ff80]' />
							<Typography variant='small'>React</Typography>
						</Div>
						<Icon name='X' className='stroke-foreground' />
						<Div className='inline-flex items-center gap-x-1'>
							<Image src='/nest.svg' alt='Laravel' className='drop-shadow-[0px_0px_4px_#ea285680]' />
							<Typography variant='small'>Nest</Typography>
						</Div>
					</Div>
				</Div>
			</Div>
		</Div>
	)
}

const Image = tw.img`size-6 object-contain object-center`

export default Footer
