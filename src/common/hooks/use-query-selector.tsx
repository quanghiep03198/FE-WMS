import { useEffect, useState } from 'react'

/**
 * Custom React hook that returns the first DOM element matching the given selector.
 *
 * @param selector - A CSS selector string to query the DOM.
 * @returns The first matching HTMLElement or null if none found.
 *
 * Usage:
 *   const divElement = useQuerySelector<HTMLDivElement>('#my-div');
 */
export default function useQuerySelector<T extends HTMLElement>(selector: string) {
	const [element, setElement] = useState<T | null>(null)

	useEffect(() => {
		if (typeof document !== 'undefined') {
			setElement(document.querySelector(selector) as T | null)
		} else {
			setElement(null)
		}
	}, [selector]) // Hook will rerun if selector changes

	return element
}
