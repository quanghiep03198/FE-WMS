import { Div, Icon, Typography } from '@/components/ui'
import tw from 'tailwind-styled-components'

const Footer: React.FC = () => {
	return (
		<Div as='footer' className='border-t p-6'>
			<Div className='mx-auto flex max-w-7xl items-center justify-between xxl:max-w-8xl'>
				<Div id='company' color='muted' className='inline-flex items-center gap-x-2 text-xs'>
					<Icon name='Boxes' size={28} strokeWidth={1} />

					<Div className='space-y-1'>
						<Typography variant='small' className='text-xs font-semibold'>
							i-WMS
						</Typography>
						<Typography variant='small' className='text-xs'>
							© {new Date().getFullYear()} GreenLand, Inc. All rights reserved.
						</Typography>
					</Div>
				</Div>
				<Div className='flex items-center justify-center gap-x-3'>
					<Typography id='company' className='text-sm font-medium'>
						Powered by
					</Typography>
					<Div className='inline-flex items-center gap-x-1'>
						<Image src='/react.svg' alt='React' className='' />
						<Typography id='company' variant='small'>
							React
						</Typography>
					</Div>
					<Icon name='X' className='stroke-foreground' />
					<Div className='inline-flex items-center gap-x-1'>
						<Image src='/laravel.svg' alt='Laravel' className='' />
						<Typography id='company' variant='small'>
							Laravel
						</Typography>
					</Div>
				</Div>
			</Div>
		</Div>
	)
}

const Image = tw.img`size-5 object-contain object-center`

export default Footer
