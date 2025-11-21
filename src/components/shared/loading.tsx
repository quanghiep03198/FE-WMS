import AppLogo from '@/app/-components/-shared/app-logo'
import GridBackground from '@/app/-components/-shared/grid-background'
import { useEventListener } from 'ahooks'
import nProgress from 'nprogress'
import { Fragment, useEffect } from 'react'
import { Div } from '../ui'

export default function Loading({ withContent = true }: { withContent?: boolean }) {
	nProgress.configure({
		showSpinner: false
	})

	useEffect(() => {
		nProgress.start()

		return () => {
			nProgress.done()
		}
	}, [])

	useEventListener('load', () => {
		document.startViewTransition()
	})

	return (
		<Fragment>
			<title>Loading ...</title>
			{withContent && (
				<Div
					data-state='expanded'
					className='group relative grid h-screen w-screen place-content-center place-items-center'>
					<Div className='z-10 h-full w-full animate-[fade-in_0.25s_ease-out_forwards]'>
						<AppLogo />
					</Div>
					<GridBackground />
				</Div>
			)}
		</Fragment>
	)
}
