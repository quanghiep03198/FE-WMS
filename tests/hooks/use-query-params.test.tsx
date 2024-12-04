import { useNavigate } from '@tanstack/react-router'
import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import useQueryParams from '../../src/common/hooks/use-query-params'

vi.mock('@tanstack/react-router', () => ({
	useNavigate: vi.fn(),
	useSearch: vi.fn(() => ({}))
}))

describe('useQueryParams', () => {
	const navigateMock = vi.fn()
	beforeEach(() => {
		const _useNavigate = useNavigate as ReturnType<typeof vi.fn>
		_useNavigate.mockReturnValue(navigateMock)
	})

	it('should set default params on mount', () => {
		const defaultParams = { foo: 'bar' }
		renderHook(() => useQueryParams(defaultParams))
		expect(navigateMock).toHaveBeenCalledWith({ search: { foo: 'bar' } })
	})

	it('should set params', () => {
		const { result } = renderHook(() => useQueryParams())
		act(() => {
			result.current.setParams({ foo: 'bar' })
		})
		expect(navigateMock).toHaveBeenCalledWith({ search: expect.any(Function) })
	})

	it('should remove param', () => {
		const { result } = renderHook(() => useQueryParams())
		act(() => {
			result.current.removeParam('foo')
		})
		expect(navigateMock).toHaveBeenCalledWith({ search: expect.any(Function) })
	})
})
