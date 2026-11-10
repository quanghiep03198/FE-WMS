import useQueryParams from '@hooks/use-query-params'
import { useNavigate } from '@tanstack/react-router'
import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@tanstack/react-router', () => ({
	useNavigate: vi.fn(),
	useSearch: vi.fn(() => ({}))
}))

describe('useQueryParams', () => {
	const navigateMock = vi.fn()
	beforeEach(() => {
		navigateMock.mockClear()
		const _useNavigate = useNavigate as ReturnType<typeof vi.fn>
		_useNavigate.mockReturnValue(navigateMock)
	})

	it('should set default params on mount', () => {
		const defaultParams = { foo: 'bar' }
		renderHook(() => useQueryParams(defaultParams))
		// The hook now merges defaultParams with prev, so search is a function
		expect(navigateMock).toHaveBeenCalledWith({ search: expect.any(Function) })
	})

	it('should preserve current params when defaults are already present', () => {
		renderHook(() => useQueryParams({ foo: 'default' }))

		const searchUpdater = navigateMock.mock.calls[0]?.[0].search
		const currentSearch = { foo: 'existing', other: 'value' }

		expect(searchUpdater(currentSearch)).toBe(currentSearch)
	})

	it('should set params', () => {
		const { result } = renderHook(() => useQueryParams())
		act(() => {
			result.current.setParams({ foo: 'bar' })
		})
		expect(navigateMock).toHaveBeenCalledWith({ search: expect.any(Function) })
	})

	it('should preserve current params when setting an unchanged value', () => {
		const { result } = renderHook(() => useQueryParams<{ foo: string }>())
		act(() => {
			result.current.setParam('foo', 'existing')
		})

		const searchUpdater = navigateMock.mock.calls[0]?.[0].search
		const currentSearch = { foo: 'existing' }

		expect(searchUpdater(currentSearch)).toBe(currentSearch)
	})

	it('should remove param', () => {
		const { result } = renderHook(() => useQueryParams())
		act(() => {
			result.current.removeParam('foo')
		})
		expect(navigateMock).toHaveBeenCalledWith({ search: expect.any(Function) })
	})

	it('should set param by key', () => {
		const { result } = renderHook(() => useQueryParams())
		act(() => {
			result.current.setParam('foo', 'bar')
		})
		expect(navigateMock).toHaveBeenCalledWith({ search: expect.any(Function) })
	})

	it('should remove all params', () => {
		const { result } = renderHook(() => useQueryParams())
		act(() => {
			result.current.removeAllParams()
		})
		expect(navigateMock).toHaveBeenCalledWith({ search: expect.any(Function) })
	})
})
