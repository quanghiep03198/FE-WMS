import { useEffect, useState } from 'react'

export default function useMediaQuery(mediaQuery: string) {
	const [isMatch, setIsMatch] = useState(false)

	useEffect(() => {
		const checkIsMatchMediaQuery = () => {
			const mediaQueryList = window.matchMedia(mediaQuery)
			setIsMatch(mediaQueryList.matches)
		}
		checkIsMatchMediaQuery()
		window.addEventListener('resize', checkIsMatchMediaQuery)

		return () => {
			window.removeEventListener('resize', checkIsMatchMediaQuery)
		}
	})

	return isMatch
}
