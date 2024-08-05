import nProgress from 'nprogress'
import { useEffect } from 'react'
import { Div, Icon } from '../ui'

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
		<Div className='w-screen h-screen grid place-content-center'>
			<Icon name='LoaderCircle' className='animate-spin' size={18} />
		</Div>
	)
}
