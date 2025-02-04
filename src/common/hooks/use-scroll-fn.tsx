import { elementScroll, VirtualizerOptions } from '@tanstack/react-virtual'
import { RefObject, useCallback } from 'react'

type ScrollToFnArgs = Parameters<VirtualizerOptions<any, any>['scrollToFn']>

const easeInOutQuint = (t: number) => {
	return t <= 0.5 ? 16 * t ** 5 : 1 + 16 * (--t) ** 5
}

export const useScrollToFn = (containerRef: RefObject<HTMLElement>, scrollingRef: RefObject<number>) => {
	return useCallback<VirtualizerOptions<any, any>['scrollToFn']>((...args: ScrollToFnArgs) => {
		const [offset, canSmooth, instance] = args
		const duration = 1000
		const start = containerRef.current.scrollTop
		const startTime = (scrollingRef.current = Date.now())

		const run = () => {
			if (scrollingRef.current !== startTime) return
			const now = Date.now()
			const elapsed = now - startTime
			const progress = easeInOutQuint(Math.min(elapsed / duration, 1))
			const interpolated = start + (offset - start) * progress

			if (elapsed < duration) {
				elementScroll(interpolated, canSmooth, instance)
				requestAnimationFrame(run)
			} else {
				elementScroll(interpolated, canSmooth, instance)
			}
		}

		requestAnimationFrame(run)
	}, [])
}
