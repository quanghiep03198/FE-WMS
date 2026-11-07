import type { PieDatum } from '@tanstack/charts/polar'

export function clipPieSweep<T extends object>(slices: readonly PieDatum<T>[], visibility: number): PieDatum<T>[] {
	const end = Math.PI / 2 - 2 * Math.PI * visibility
	return slices.map((slice) => ({
		...slice,
		startAngle: Math.max(slice.startAngle, end),
		endAngle: Math.max(slice.endAngle, end)
	}))
}
