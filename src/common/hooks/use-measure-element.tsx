import { DependencyList, useMemo } from 'react'

export default function useMeasureElement<T extends HTMLElement>(shouldMeasure?: boolean, deps?: DependencyList) {
	shouldMeasure ??= true
	deps ??= []

	return useMemo(
		() =>
			shouldMeasure && typeof window !== 'undefined' && navigator.userAgent.indexOf('Firefox') === -1
				? (element: T) => element?.getBoundingClientRect()?.height
				: undefined,
		[window, navigator.userAgent, shouldMeasure, ...deps]
	)
}
