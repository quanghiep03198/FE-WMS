import { useSyncExternalStore } from 'react'

type BrowserTabStatus = 'active' | 'idle' | 'hidden'

type BrowserTabActivityOptions = {
	/**
	 * The time in milliseconds after which the tab is considered idle.
	 */
	idleTime?: number
	onIdle?: () => void
	onResume?: () => void
	onInactive?: () => void
	onActive?: () => void
}

export function useBrowserTabStatus(options: BrowserTabActivityOptions = {}): BrowserTabStatus {
	const { idleTime = 5 * 60 * 1000, onIdle, onResume, onInactive, onActive } = options

	let isVisible = document.visibilityState === 'visible'
	let isIdle = false
	let idleTimeout: ReturnType<typeof setTimeout> | null = null

	const subscribers = new Set<() => void>()

	const getStatusSnapshot = (): BrowserTabStatus => {
		if (!isVisible) return 'hidden'
		if (isIdle) return 'idle'
		return 'active'
	}

	const broadcastChange = () => subscribers.forEach((cb) => cb())

	const resetIdle = () => {
		if (isIdle) {
			isIdle = false
			if (onResume) onResume()
			broadcastChange()
		}
		if (idleTimeout) clearTimeout(idleTimeout)
		idleTimeout = setTimeout(() => {
			isIdle = true
			if (typeof onIdle === 'function') onIdle()
			broadcastChange()
		}, idleTime)
	}

	const onVisibilityChange = () => {
		const visibleNow = document.visibilityState === 'visible'
		if (visibleNow !== isVisible) {
			isVisible = visibleNow
			broadcastChange()
			if (typeof onActive === 'function' && typeof onInactive === 'function') {
				if (visibleNow) onActive()
				else onInactive()
			}
		}
	}

	const startTracking = () => {
		document.addEventListener('visibilitychange', onVisibilityChange)
		window.addEventListener('mousemove', resetIdle)
		window.addEventListener('keydown', resetIdle)
		resetIdle() // start initial timer
	}

	const stopTracking = () => {
		document.removeEventListener('visibilitychange', onVisibilityChange)
		window.removeEventListener('mousemove', resetIdle)
		window.removeEventListener('keydown', resetIdle)
		if (idleTimeout) clearTimeout(idleTimeout)
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
