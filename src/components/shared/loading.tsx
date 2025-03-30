import AppLogo from '@/app/_components/_shared/-app-logo'
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
		<Div data-state='expanded' className='group grid h-screen place-content-center'>
			<Div className='animate-[fade-in_.125s_cubic-bezier(.25,.25,0,1)_.25s_both!important]'>
				<AppLogo />
			</Div>
		</Div>
	)
}
