import nProgress from 'nprogress'
import { useEffect } from 'react'
import { Div, Icon, Typography } from '../ui'

export default function Loading() {
	nProgress.configure({
		showSpinner: false
	})
	useEffect(() => {
		nProgress.start()

		return () => {
			nProgress.done()
		}
	}, [])

	return (
		<Div className='w-screen h-screen flex justify-center items-center gap-x-2'>
			<Icon name='LoaderCircle' className='animate-spin' size={18} />
			<Typography variant='small' className='tracking-wide font-medium'>
				Loading ...
			</Typography>
		</Div>
	)
}
