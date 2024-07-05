type TMediaQuery = { minWidth?: number; maxWidth?: number }

/**
 * Create a custom responsive breakpoint
 * @returns
 */
export const $mediaQuery = ({ minWidth = 0, maxWidth }: TMediaQuery): string => {
	if (!maxWidth) return `(min-width: ${minWidth}px)`
	return `(min-width: ${minWidth}px) and (max-width: ${maxWidth}px)`
}