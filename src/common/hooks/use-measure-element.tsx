import { DependencyList, useMemo } from 'react'

export default function useMeasureElement<T extends HTMLElement>(
	{ shouldMeasure, estimateSize }: { shouldMeasure: boolean; estimateSize: number } = {
		shouldMeasure: true,
		estimateSize: 40
	},
	deps: DependencyList = []
) {
	return useMemo(
		() =>
			shouldMeasure && typeof window !== 'undefined' && navigator.userAgent.indexOf('Firefox') === -1
				? (element: T) => element?.getBoundingClientRect()?.height ?? estimateSize
				: undefined,
		[window, navigator.userAgent, devicePixelRatio, shouldMeasure, ...deps]
	)
}
