// @vitest-environment jsdom

import { act, cleanup, render } from '@testing-library/react'
import React from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { Typewriter } from '@components/customs/type-writter'

vi.mock('ahooks', async () => {
	const { useState } = await import('react')
	return { useRafState: useState, useUpdateEffect: () => undefined }
})

vi.mock('react-i18next', () => ({
	useTranslation: () => ({ i18n: { language: 'en' } })
}))

describe('Typewriter timer cleanup', () => {
	beforeEach(() => {
		vi.useFakeTimers()
	})

	afterEach(() => {
		cleanup()
		vi.useRealTimers()
	})

	it('cancels the delay when unmounted before typing starts', () => {
		const { unmount } = render(<Typewriter delay={100} text='hello' />)
		unmount()

		expect(vi.getTimerCount()).toBe(0)
	})

	it('cancels the active interval when paused and resumes typing', () => {
		const { container, rerender, unmount } = render(<Typewriter text='hello' typeSpeed={10} />)

		act(() => vi.advanceTimersByTime(20))
		expect(container.textContent).toBe('he')

		rerender(<Typewriter playState='paused' text='hello' typeSpeed={10} />)
		expect(vi.getTimerCount()).toBe(0)

		rerender(<Typewriter text='hello' typeSpeed={10} />)
		act(() => vi.advanceTimersByTime(30))
		expect(container.textContent).toBe('hello')

		unmount()
		expect(vi.getTimerCount()).toBe(0)
	})

	it('cancels the old delay when the text changes', () => {
		const { container, rerender } = render(<Typewriter delay={100} text='old' typeSpeed={10} />)
		act(() => vi.advanceTimersByTime(50))
		rerender(<Typewriter delay={100} text='new' typeSpeed={10} />)

		act(() => vi.advanceTimersByTime(60))
		expect(container.textContent).toBe('')
		act(() => vi.advanceTimersByTime(50))
		expect(container.textContent).toBe('n')
	})
})
