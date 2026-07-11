import { useRafState } from 'ahooks'
import { useCallback, useEffect } from 'react'

/**
 * Custom React hook to determine if a given CSS media query matches the current viewport.
 *
 * @param mediaQuery - A string representing the CSS media query to evaluate (e.g., '(max-width: 600px)').
 * @returns {boolean} - Returns true if the media query matches, otherwise false.
 *
 * @example
 * const isMobile = useMediaQuery('(max-width: 600px)');
 */
export default function useMediaQuery(mediaQuery: string) {
	const [isMatch, setIsMatch] = useRafState(false)

	const checkIsMatchMediaQuery = useCallback(() => {
		if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
			return
		}

		const mediaQueryList = window.matchMedia(mediaQuery)
		setIsMatch(mediaQueryList.matches)
	}, [mediaQuery, setIsMatch])

	useEffect(() => {
		if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
			return
		}

		checkIsMatchMediaQuery()

		const mediaQueryList = window.matchMedia(mediaQuery)

		if (typeof mediaQueryList.addEventListener === 'function') {
			mediaQueryList.addEventListener('change', checkIsMatchMediaQuery)
		} else if (typeof mediaQueryList.addListener === 'function') {
			mediaQueryList.addListener(checkIsMatchMediaQuery)
		}

		return () => {
			if (typeof mediaQueryList.removeEventListener === 'function') {
				mediaQueryList.removeEventListener('change', checkIsMatchMediaQuery)
			} else if (typeof mediaQueryList.removeListener === 'function') {
				mediaQueryList.removeListener(checkIsMatchMediaQuery)
			}
		}
	}, [checkIsMatchMediaQuery, mediaQuery])

	return isMatch
}
