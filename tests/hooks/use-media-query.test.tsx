import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import useMediaQuery from '../../src/common/hooks/use-media-query'

describe('useMediaQuery', () => {
	it('should return true when media query matches', () => {
		window.matchMedia = vi.fn().mockImplementation((query) => ({
			matches: query === '(min-width: 600px)',
			addListener: vi.fn(),
			removeListener: vi.fn()
		}))

		const { result } = renderHook(() => useMediaQuery('(min-width: 600px)'))
		expect(result.current).toBe(true)
	})

	it('should return false when media query does not match', () => {
		window.matchMedia = vi.fn().mockImplementation((query) => ({
			matches: query === '(min-width: 600px)',
			addListener: vi.fn(),
			removeListener: vi.fn()
		}))

		const { result } = renderHook(() => useMediaQuery('(min-width: 800px)'))
		expect(result.current).toBe(false)
	})
})
