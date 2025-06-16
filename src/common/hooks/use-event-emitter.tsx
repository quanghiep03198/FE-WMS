import { useCallback, useEffect, useRef, useState } from 'react'

class GlobalEventEmitter extends EventTarget {}

export const globalEventEmitter = new GlobalEventEmitter()

export default function useEventEmitter<T>(
	eventName: string,
	defaultEventData?: T
): [T, (eventData: T, skipRender?: boolean) => void] {
	const [eventData, setEventData] = useState<T>(defaultEventData)
	const skipRerender = useRef(false)

	const dispatchEvent = useCallback(
		(eventData: T, skipRender = true) => {
			skipRerender.current = skipRender
			const event = new CustomEvent(eventName, { detail: eventData })
			globalEventEmitter.dispatchEvent(event)
		},
		[eventName]
	)

	useEffect(() => {
		const listener = (event: Event) => {
			if (skipRerender.current) {
				skipRerender.current = false
				return
			}
			setEventData((event as CustomEvent).detail)
		}

		globalEventEmitter.addEventListener(eventName, listener)

		// Cleanup subscription on unmount
		return () => {
			globalEventEmitter.removeEventListener(eventName, listener)
		}
	}, [eventName, skipRerender])

	return [eventData, dispatchEvent]
}
