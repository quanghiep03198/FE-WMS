// @vitest-environment jsdom

import { cleanup, render } from '@testing-library/react'
import React from 'react'
import { afterEach, expect, it, vi } from 'vitest'
import { Carousel } from '@components/ui/carousel'

const { api } = vi.hoisted(() => ({
	api: {
		canScrollPrev: vi.fn(() => false),
		canScrollNext: vi.fn(() => false),
		on: vi.fn(),
		off: vi.fn()
	}
}))

vi.mock('embla-carousel-react', () => ({
	default: () => [vi.fn(), api]
}))

afterEach(() => {
	cleanup()
	vi.clearAllMocks()
})

it('removes both registered carousel listeners on unmount', () => {
	const { unmount } = render(<Carousel />)
	const reInitListener = api.on.mock.calls.find(([event]) => event === 'reInit')?.[1]
	const selectListener = api.on.mock.calls.find(([event]) => event === 'select')?.[1]

	expect(reInitListener).toBeDefined()
	expect(selectListener).toBeDefined()
	unmount()
	expect(api.off).toHaveBeenCalledWith('reInit', reInitListener)
	expect(api.off).toHaveBeenCalledWith('select', selectListener)
})
