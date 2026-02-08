import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import useMediaQuery from '../../src/common/hooks/use-media-query'

function mockMatchMedia(matches: boolean) {
	window.matchMedia = vi.fn().mockImplementation(() => ({
		matches,
		media: '',
		onchange: null,
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		addListener: vi.fn(),
		removeListener: vi.fn(),
		dispatchEvent: vi.fn()
	}))
}

describe('useMediaQuery', () => {
	beforeEach(() => {
		vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
			cb(0)
			return 0
		})
	})

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('should return true when media query matches', () => {
		mockMatchMedia(true)

		const { result } = renderHook(() => useMediaQuery('(min-width: 600px)'))

		expect(result.current).toBe(true)
	})

	it('should return false when media query does not match', () => {
		mockMatchMedia(false)

		const { result } = renderHook(() => useMediaQuery('(min-width: 800px)'))

		expect(result.current).toBe(false)
	})
})
