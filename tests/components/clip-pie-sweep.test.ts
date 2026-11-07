import { pie } from '@tanstack/charts/polar'
import { expect, it } from 'vitest'

import { clipPieSweep } from '@features/dashboard/helpers/clip-pie-sweep'

it('reveals successive slices counterclockwise, without changing their final angles', () => {
	const slices = pie(
		[{ id: 'a', qty: 1 }, { id: 'b', qty: 1 }, { id: 'c', qty: 2 }],
		{ value: 'qty', startAngle: Math.PI / 2, endAngle: -3 * Math.PI / 2 }
	)
	const empty = clipPieSweep(slices, 0)
	expect(empty.every((slice) => slice.startAngle === slice.endAngle)).toBe(true)
	const half = clipPieSweep(slices, 0.5)
	expect(half[0].endAngle).toBeCloseTo(slices[0].endAngle)
	expect(half[1].endAngle).toBeCloseTo(slices[1].endAngle)
	expect(half[2].startAngle).toBeCloseTo(half[2].endAngle)
	const full = clipPieSweep(slices, 1)
	expect(full.map(({ startAngle, endAngle }) => [startAngle, endAngle]))
		.toEqual(slices.map(({ startAngle, endAngle }) => [startAngle, endAngle]))
})
