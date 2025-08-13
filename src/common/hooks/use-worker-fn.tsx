import { useCallback, useEffect, useRef, useState } from 'react'

export function useWorkerFn<TArgs extends any[], TResult>(
	fn: (...args: TArgs) => TResult
): [(...args: TArgs) => Promise<TResult>, boolean, boolean] {
	const workerRef = useRef<Worker | null>(null)
	const [isPending, setIsPending] = useState<boolean>(false)
	const [isError, setIsError] = useState<boolean>(false)

	useEffect(() => {
		// Create a worker blob from the function
		const blob = new Blob(
			[
				/* JavaScript */ `
            self.onmessage = async (e) => {
               const { fnString, args } = e.data;
               const fn = new Function('return ' + fnString)();
               const result = await fn(...args);
               self.postMessage(result);
            };
         `
			],
			{ type: 'application/javascript' }
		)

		workerRef.current = new Worker(URL.createObjectURL(blob))

		return () => {
			if (workerRef.current) {
				workerRef.current.terminate()
				workerRef.current = null
			}
		}
	}, [])

	const execute = useCallback(
		async (...args: TArgs): Promise<TResult> => {
			setIsPending(true)
			setIsError(true)
			try {
				return await new Promise((resolve, reject) => {
					if (!workerRef.current) {
						reject(new Error('Worker is not initialized'))
						return
					}

					const fnString = fn.toString()

					workerRef.current.onmessage = (e) => {
						console.log('e.data :>> ', e.data)
						resolve(e.data)
					}

					workerRef.current.onerror = (e) => {
						reject(e.message)
					}

					workerRef.current.postMessage({ fnString, args })
				})
			} catch {
				setIsError(true)
			} finally {
				setIsPending(false)
			}
		},
		[fn]
	)

	return [execute, isPending, isError]
}
