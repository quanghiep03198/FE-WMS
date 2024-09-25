import { Div, Icon, Typography } from '@/components/ui'
import tw from 'tailwind-styled-components'

const Footer: React.FC = () => {
	return (
		<Div as='footer' className='border-t p-6'>
			<Div className='mx-auto flex max-w-7xl items-center justify-between xxl:max-w-8xl'>
				<Typography variant='small'>© {new Date().getFullYear()} GreenLand, Inc. All rights reserved.</Typography>
				<Div className='flex items-center justify-center gap-x-3'>
					<Typography id='company' className='text-sm'>
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
						<Image src='/nest.svg' alt='Laravel' className='' />
						<Typography id='company' variant='small'>
							Nest.js
						</Typography>
					</Div>
				</Div>
			</Div>
		</Div>
	)
}

const Image = tw.img`size-5 object-contain object-center`

export default Footer
