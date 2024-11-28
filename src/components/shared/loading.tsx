import { useEventListener } from 'ahooks'
import nProgress from 'nprogress'
import { useEffect } from 'react'

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

	return null
}
