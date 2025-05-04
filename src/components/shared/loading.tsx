import AppLogo from '@/app/_components/_shared/-app-logo'
import GridBackground from '@/app/_components/_shared/-grid-background'
import { useEventListener } from 'ahooks'
import nProgress from 'nprogress'
import { Fragment, useEffect } from 'react'
import { Div } from '../ui'

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

	useEventListener('load', () => {
		document.startViewTransition()
	})

	return (
		<Fragment>
			<head>
				<title>Loading ...</title>
			</head>
			<Div data-state='expanded' className='group relative flex h-screen items-center justify-center'>
				<Div className='z-10 animate-[fade-in_0.25s_ease-out_forwards]'>
					<AppLogo />
				</Div>
				<GridBackground />
			</Div>
		</Fragment>
	)
}
