/**
 * Create a custom responsive breakpoint
 * @returns
 */
export const createBreakpoint = ({ minWidth, maxWidth }: { minWidth: number; maxWidth?: number }): string => {
	if (!maxWidth) return `(min-width: ${minWidth}px)`
	return `(min-width: ${minWidth}px) and (max-width: ${maxWidth}px)`
}
