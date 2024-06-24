import nProgress from 'nprogress'
import { useEffect } from 'react'

const Loading: React.FunctionComponent = () => {
	nProgress.configure({
		showSpinner: false
	})
	useEffect(() => {
		nProgress.start()

		return () => {
			nProgress.done()
		}
	}, [])

	return null
}

export default Loading
