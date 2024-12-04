import { useCallback, useEffect, useState } from 'react'

export default function useWebWorker<T>(workerFn: (e: MessageEvent<T>) => any, payload: T) {
	const [data, setData] = useState<T>(null)
	const [loading, setLoading] = useState<boolean>(false)
	const [error, setError] = useState<Error>(null)

	const memorizedWorkerFn = useCallback(workerFn, [])

	useEffect(() => {
		setLoading(true)
		setError(null)

		try {
			const evaluation = memorizedWorkerFn.toString()
			const blob = new Blob([`(${evaluation})()`], { type: 'application/javascript' })
			const workerScriptURL = URL.createObjectURL(blob)
			const worker = new Worker(workerScriptURL)

			worker.postMessage(payload)

			worker.onmessage = (e: MessageEvent<T>) => {
				setData(e.data)
				setLoading(false)
			}

			worker.onerror = (e: ErrorEvent) => {
				setError(e.error)
				setLoading(false)
			}

			return () => {
				worker.terminate()
				URL.revokeObjectURL(workerScriptURL)
			}
		} catch (error) {
			setError(error)
			setLoading(false)
		}
	}, [payload, memorizedWorkerFn])

	return { data, loading, error }
}
