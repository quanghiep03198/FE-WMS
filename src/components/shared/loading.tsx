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
		<Div className='flex h-screen w-screen items-center justify-center gap-x-2'>
			<Icon name='LoaderCircle' className='animate-spin' size={18} />
			<Typography variant='small' className='font-medium tracking-wide'>
				Loading ...
			</Typography>
		</Div>
	)
}
