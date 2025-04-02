import { Div, Typography } from '@/components/ui'
import React from 'react'
import tw from 'tailwind-styled-components'

const UnsupportedScreen: React.FC = () => {
	return (
		<Div className='fixed inset-0 z-[9999] flex h-screen w-full items-center justify-center bg-background p-6 sm:p-4'>
			<Div className='z-10 flex flex-row items-center justify-center gap-6 sm:flex-col'>
				<Image src='/onboarding.svg' />
				<Div className='animate-fly-in *:text-pretty'>
					<Typography variant='h4' color='destructive' className='mb-2'>
						Unsupported Screen
					</Typography>
					<Typography className='mb-4'>
						Sorry, the current screen size of your device is not fully supported for the best experience on this
						website.
					</Typography>
					<Typography variant='small' color='muted' className='mb-4 text-sm'>
						We recommend accessing the website on a device with a larger screen size.
					</Typography>
				</Div>
			</Div>
		</Div>
	)
}

const Image = tw.img`max-w-sm object-center object-contain w-full animate-[fade-in_0.35s_ease-out_0s]`

export default UnsupportedScreen
