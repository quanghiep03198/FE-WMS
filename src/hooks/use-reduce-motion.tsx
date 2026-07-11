import { useSyncExternalStore } from 'react'
import { isBrowser } from '../common/utils/browser'

const prefersReducedMotionMediaQuery = isBrowser && window.matchMedia('(prefers-reduced-motion: reduce)')

/**
 * @returns boolean value If the user has expressed their preference for reduced motion.
 */
export const useReducedMotion = (): boolean => {
	if (!prefersReducedMotionMediaQuery) return false
	return useSyncExternalStore(
		(callback) => {
			prefersReducedMotionMediaQuery.addEventListener('change', callback)
			return () => {
				prefersReducedMotionMediaQuery.removeEventListener('change', callback)
			}
		},
		() => prefersReducedMotionMediaQuery.matches,
		() => false
	)
}
