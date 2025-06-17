import { Button, Div, Input, Label, Typography } from '@/components/ui'
import { Separator } from '@radix-ui/react-context-menu'

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
					<Div className='basis-2/5 space-y-1.5 sm:basis-full md:basis-full'>
						<Label htmlFor='subscribe' className='text-lg'>
							Subscribe to our updates
						</Label>
						<Typography variant='small' color='muted' className='!mb-6 block w-full max-w-96'>
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
					<a
						href='https://github.com/quanghiep03198'
						className='inline-flex items-center gap-x-2 text-sm text-muted-foreground'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='24'
							height='24'
							fill='currentColor'
							className='bi bi-github'
							viewBox='0 0 16 16'>
							<path d='M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8' />
						</svg>
						{/* Developed by @quanghiep03198 */}
					</a>
				</Div>
			</Div>
		</Div>
	)
}

export default Footer
