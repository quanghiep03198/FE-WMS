import { useMemoizedFn } from 'ahooks'
import { useRef, useSyncExternalStore } from 'react'

type BrowserTabStatus = 'active' | 'idle' | 'hidden'

type BrowserTabActivityOptions = {
	/**
	 * The time in milliseconds after which the tab is considered idle.
	 */
	idleTime?: number
	/**
	 * The time in milliseconds after which the tab is considered hidden.
	 */
	hiddenTime?: number
	onIdle?: () => void
	onResume?: () => void
	onInactive?: () => void
	onActive?: () => void
}

export function useBrowserTabStatus(options: BrowserTabActivityOptions = {}): BrowserTabStatus {
	const { idleTime = 5 * 60 * 1000, hiddenTime = 0, onIdle, onResume, onInactive, onActive } = options

	const subscribers = new Set<() => void>()
	const isVisibleRef = useRef<boolean>(document.visibilityState === 'visible')
	const isIdleRef = useRef<boolean>(false)
	const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null) // useRef to store the timeout ID

	const getStatusSnapshot = (): BrowserTabStatus => {
		if (!isVisibleRef) return 'hidden'
		if (isIdleRef) return 'idle'
		return 'active'
	}

	const broadcastChange = () => subscribers.forEach((cb) => cb())

	const resetIdle = useMemoizedFn(() => {
		if (isIdleRef.current) {
			isIdleRef.current = false
			if (typeof onResume === 'function') onResume()
			broadcastChange()
		}
		if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current)
		idleTimeoutRef.current = setTimeout(() => {
			isIdleRef.current = true
			if (typeof onIdle === 'function') onIdle()
			broadcastChange()
		}, idleTime)
	})

	const onVisibilityChange = () => {
		const visibleNow = document.visibilityState === 'visible'
		if (visibleNow !== isVisibleRef.current) {
			isVisibleRef.current = visibleNow
			broadcastChange()
			if (visibleNow && typeof onActive === 'function') onActive()
			if (!visibleNow && typeof onInactive === 'function') {
				if (hiddenTime > 0)
					setTimeout(() => {
						onInactive()
					}, hiddenTime)
				else onInactive()
			}
		}
	}

	const startTracking = () => {
		document.addEventListener('visibilitychange', onVisibilityChange)
		window.addEventListener('mousemove', resetIdle)
		window.addEventListener('keydown', resetIdle)
	}

	const stopTracking = () => {
		document.removeEventListener('visibilitychange', onVisibilityChange)
		window.removeEventListener('mousemove', resetIdle)
		window.removeEventListener('keydown', resetIdle)
		if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current)
	}

	const subscribe = (callback: () => void) => {
		if (subscribers.size === 0) startTracking()
		subscribers.add(callback)
		return () => {
			subscribers.delete(callback)
			if (subscribers.size === 0) stopTracking()
		}
	}

	return useSyncExternalStore(subscribe, getStatusSnapshot)
}
