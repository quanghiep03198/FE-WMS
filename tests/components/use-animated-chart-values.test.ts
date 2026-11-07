import { act, renderHook } from '@testing-library/react'
import React from 'react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'

import { useAnimatedChartValues } from '@hooks/use-animated-chart-values'

type Row = { id: string; value: number; label?: string }
const accessors = {
	key: (row: Row) => row.id,
	value: (row: Row) => row.value,
	withValue: (row: Row, value: number): Row => ({ ...row, value })
}

let frames: Map<number, FrameRequestCallback>
let frameId: number
let reduced: boolean
let changeMotion: (() => void) | undefined

beforeEach(() => {
	frames = new Map()
	frameId = 0
	reduced = false
	changeMotion = undefined
	vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
		frames.set(++frameId, callback)
		return frameId
	})
	vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
		frames.delete(id)
	})
	vi.spyOn(window, 'matchMedia').mockImplementation(() => ({
		get matches() {
			return reduced
		},
		media: '(prefers-reduced-motion: reduce)',
		onchange: null,
		addListener: () => undefined,
		removeListener: () => undefined,
		dispatchEvent: () => false,
		addEventListener: (_event, listener) => {
			changeMotion = () => {
				if (typeof listener === 'function') listener(new Event('change'))
				else listener?.handleEvent(new Event('change'))
			}
		},
		removeEventListener: () => {
			changeMotion = undefined
		}
	}))
})

afterEach(() => vi.restoreAllMocks())

function frame(time: number) {
	const scheduled = [...frames.values()]
	frames.clear()
	act(() => scheduled.forEach((callback) => callback(time)))
}

it('animates the first data, ignores equivalent updates and retargets from the current frame', () => {
	const { result, rerender, unmount } = renderHook(
		({ data }: { data: Row[] }) => useAnimatedChartValues(data, accessors),
		{ initialProps: { data: [{ id: 'a', value: 10 }] as Row[] } }
	)
	expect(frames.size).toBe(1)
	frame(0)
	expect(result.current.values[0].value).toBe(0)
	expect(result.current.visibility).toBe(0)
	frame(250)
	expect(result.current.values[0].value).toBeGreaterThan(0)
	expect(result.current.visibility).toBeGreaterThan(0)
	rerender({ data: [{ id: 'a', value: 10, label: 'new label' }] })
	frame(500)
	expect(result.current.values[0]).toEqual({ id: 'a', value: 10, label: 'new label' })
	expect(result.current.visibility).toBe(1)
	rerender({ data: [{ id: 'a', value: 10, label: 'new label' }] })
	expect(frames.size).toBe(0)
	expect(result.current.values[0].label).toBe('new label')

	rerender({ data: [{ id: 'a', value: 30 }] })
	frame(600)
	expect(result.current.values[0].value).toBe(10)
	frame(850)
	const halfway = result.current.values[0].value
	expect(halfway).toBeGreaterThan(10)
	expect(halfway).toBeLessThan(30)
	rerender({ data: [{ id: 'a', value: 5 }] })
	frame(900)
	expect(result.current.values[0].value).toBe(halfway)
	frame(1400)
	expect(result.current.values[0].value).toBe(5)
	expect(frames.size).toBe(0)
	unmount()
})

it('animates entering and removed keys and cancels pending frames on unmount', () => {
	const { result, rerender, unmount } = renderHook(
		({ data }: { data: Row[] }) => useAnimatedChartValues(data, accessors),
		{ initialProps: { data: [{ id: 'a', value: 10 }] } }
	)
	frame(0)
	frame(500)
	rerender({ data: [{ id: 'b', value: 20 }] })
	frame(600)
	expect(result.current.values).toEqual([
		{ id: 'b', value: 0 },
		{ id: 'a', value: 10 }
	])
	frame(850)
	expect(result.current.values[0].value).toBeGreaterThan(0)
	expect(result.current.values[1].value).toBeGreaterThan(0)
	frame(1100)
	expect(result.current.values).toEqual([{ id: 'b', value: 20 }])
	rerender({ data: [{ id: 'b', value: 30 }] })
	expect(frames.size).toBe(1)
	unmount()
	expect(frames.size).toBe(0)
})

it('snaps when reduced motion is enabled, including during a transition', () => {
	const { result, rerender } = renderHook(({ data }: { data: Row[] }) => useAnimatedChartValues(data, accessors), {
		initialProps: { data: [{ id: 'a', value: 10 }] }
	})
	frame(0)
	frame(500)
	rerender({ data: [{ id: 'a', value: 20 }] })
	frame(600)
	frame(700)
	reduced = true
	act(() => changeMotion?.())
	expect(result.current.values[0].value).toBe(20)
	expect(frames.size).toBe(0)
	rerender({ data: [{ id: 'a', value: 30 }] })
	expect(result.current.values[0].value).toBe(30)
	expect(frames.size).toBe(0)
})

it('waits for initial data and preserves entrance animation under Strict Mode', () => {
	const wrapper = ({ children }: { children: React.ReactNode }) =>
		React.createElement(React.StrictMode, null, children)
	const { result, rerender } = renderHook(
		({ data }: { data: Row[] | undefined }) => useAnimatedChartValues(data, accessors),
		{ initialProps: { data: undefined as Row[] | undefined }, wrapper }
	)
	expect(frames.size).toBe(0)
	rerender({ data: [{ id: 'a', value: 10 }] })
	frame(0)
	frame(250)
	const partial = result.current.values[0].value
	rerender({ data: [{ id: 'a', value: 10 }] })
	frame(500)
	expect(partial).toBeGreaterThan(0)
	expect(partial).toBeLessThan(10)
	expect(result.current.values[0].value).toBe(10)
	expect(result.current.visibility).toBe(1)
})

it('runs the entrance with data already present in Strict Mode', () => {
	const wrapper = ({ children }: { children: React.ReactNode }) =>
		React.createElement(React.StrictMode, null, children)
	const { result } = renderHook(() => useAnimatedChartValues([{ id: 'a', value: 10 }], accessors), { wrapper })
	expect(frames.size).toBe(1)
	frame(0)
	expect(result.current.values[0].value).toBe(0)
	frame(500)
	expect(result.current.values[0].value).toBe(10)
})

it('retains the original extent while values animate down to zero', () => {
	const { result, rerender } = renderHook(({ data }: { data: Row[] }) => useAnimatedChartValues(data, accessors), {
		initialProps: { data: [{ id: 'a', value: 100 }] }
	})
	frame(0)
	frame(500)
	rerender({ data: [{ id: 'a', value: 0 }] })
	frame(600)
	frame(850)
	expect(result.current.values[0].value).toBeGreaterThan(0)
	expect(result.current.values[0].value).toBeLessThan(100)
	expect(result.current.extent).toEqual([0, 100])
	expect(result.current.visibility).toBeGreaterThan(0)
	expect(result.current.visibility).toBeLessThan(1)
	frame(1100)
	expect(result.current.values[0].value).toBe(0)
	expect(result.current.visibility).toBe(0)
})
