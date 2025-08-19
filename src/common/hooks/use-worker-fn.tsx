import { useCallback, useEffect, useRef, useState } from 'react'

export function useWorkerFn<TArgs extends unknown[], TResult>(
	fn: (...args: TArgs) => TResult
): { execute: (...args: TArgs) => Promise<TResult>; isPending: boolean; isError: boolean } {
	const workerRef = useRef<Worker | null>(null)
	const [isPending, setIsPending] = useState<boolean>(false)
	const [isError, setIsError] = useState<boolean>(false)

	useEffect(() => {
		// Create a worker blob from the function
		const blob = new Blob(
			[
				/* JavaScript */ `
            self.onmessage = async (e) => {
               const { rawFunction, args } = e.data;
               const fn = new Function('return ' + rawFunction)();
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

					const rawFunction = fn.toString()

					workerRef.current.onmessage = (e) => {
						resolve(e.data)
					}

					workerRef.current.onerror = (e) => {
						reject(e.message)
					}

					workerRef.current.postMessage({ rawFunction, args })
				})
			} catch {
				setIsError(true)
			} finally {
				setIsPending(false)
			}
		},
		[fn]
	)

	return { execute, isPending, isError }
}
