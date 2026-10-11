import useSelectedText from '@hooks/use-selected-text'
import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

describe('useSelectedText', () => {
	it('should initialize with an empty string', () => {
		const { result } = renderHook(() => useSelectedText())
		const [text] = result.current
		expect(text).toBe('')
	})

	it('should update text when select is called', () => {
		const { result } = renderHook(() => useSelectedText())
		const [, select] = result.current

		// Mock window.getSelection
		const mockSelection = {
			toString: () => 'selected text'
		} as Selection
		vi.spyOn(window, 'getSelection').mockReturnValue(mockSelection)

		act(() => {
			select()
		})

		const [text] = result.current
		expect(text).toBe('selected text')
	})
})
