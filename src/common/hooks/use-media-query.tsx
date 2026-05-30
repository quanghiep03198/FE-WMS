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
		const mediaQueryList = window.matchMedia(mediaQuery)
		setIsMatch(mediaQueryList.matches)
	}, [mediaQuery])

	useEffect(() => {
		checkIsMatchMediaQuery()
		window.addEventListener('resize', checkIsMatchMediaQuery)

		return () => {
			window.removeEventListener('resize', checkIsMatchMediaQuery)
		}
	}, [mediaQuery])

	return isMatch
}
