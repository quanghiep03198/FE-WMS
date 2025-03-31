import AppLogo from '@/app/_components/_shared/-app-logo'
import GridBackground from '@/app/_components/_shared/-grid-background'
import { useEventListener } from 'ahooks'
import nProgress from 'nprogress'
import { useEffect } from 'react'
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

	useEventListener('load', () => document.startViewTransition())

	return (
		<Div data-state='expanded' className='group relative flex h-screen items-center justify-center'>
			<Div className='z-10 animate-[fade_.5s_cubic-bezier(.25,.25,.5,1)_.125s_both!important]'>
				<AppLogo />
			</Div>
			<GridBackground />
		</Div>
	)
}
