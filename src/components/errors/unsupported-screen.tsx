import { Div, Typography } from '@/components/ui'
import React from 'react'

const UnsupportedScreen: React.FC = () => {
	return (
		<Div className='bg-background fixed inset-0 z-9999 hidden h-screen w-full items-center justify-center p-6 sm:flex sm:p-4'>
			<Div className='z-10 flex flex-row items-center justify-center gap-6 sm:flex-col'>
				<Div className='animate-in fade-in-0 slide-in-from-bottom-4 duration-700 *:text-pretty'>
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

export default UnsupportedScreen
