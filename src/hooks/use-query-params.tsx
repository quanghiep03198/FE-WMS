import type { UseNavigateResult } from '@tanstack/react-router'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useCallback, useLayoutEffect, useRef } from 'react'

type NavigateFnOptions = Parameter<UseNavigateResult<string>>
type UseSearchOptions = NonNullable<FirstParameter<typeof useSearch>>
type SearchParamsObject = Record<string, unknown>

/**
 * Custom React hook to manage URL query parameters.
 * This hook provides an easy way to read, set, and remove query parameters from the URL.
 * It leverages the `useSearch` and `useNavigate` hooks from `@tanstack/react-router`.
 * @param {T} [defaultParams] - An optional object containing default query parameters to initialize the URL with.
 * @returns {Object} An object containing:
 * - `searchParams`: The current query parameters as an object of type T.
 * - `setParams`: A function to set or update multiple query parameters.
 * - `setParam`: A function to set or update a specific query parameter by key.
 * - `removeParam`: A function to remove one or more query parameters by key.
 * - `removeAllParams`: A function to remove all query parameters.
 * @example
 * const { searchParams, setParams, removeParam } = useQueryParams<{ page: string; filter: string }>({ page: '1' });
 * setParams({ filter: 'active' }); // Updates URL to include ?page=1&filter=active
 * removeParam('page'); // Updates URL to include ?filter=active
 * console.log(searchParams); // { filter: 'active' }
 * Note: This hook assumes that the component using it is wrapped within a `Router` context provided by `@tanstack/react-router`.
 */

export default function useQueryParams<
	T extends SearchParamsObject = SearchParamsObject,
	TSelected = T
>(
	defaultParams?: Partial<T>,
	options?: Omit<UseSearchOptions, 'select'> & {
		select?: (search: T) => TSelected
	}
) {
	const navigate = useNavigate()
	const defaultParamsRef = useRef(defaultParams)

	const search = useSearch({ strict: false, ...options } as never) as unknown as TSelected
	/**
	 * Set search params from URL
	 * @param { Partial<T> } params
	 * @returns {Promise<void>}
	 */
	const setParams = useCallback(
		(params: Partial<T>, options: { overrideExisting: boolean } = { overrideExisting: false }) => {
			navigate({
				search: (prev) => {
					const next = {
						...(options.overrideExisting ? {} : (prev as T)),
						...params
					}
					const current = prev as T
					if (
						Object.keys(next).length === Object.keys(current).length &&
						Object.keys(next).every((key) => next[key] === current[key])
					) {
						return prev
					}
					return next
				}
			} as NavigateFnOptions)
		},
		[navigate]
	)

	/**
	 * Set a single search param from URL
	 * @param { keyof T } key
	 * @param { T[keyof T] } value
	 * @returns {Promise<void>}
	 */
	const setParam = useCallback(
		<K extends keyof T>(key: K, value: T[K]) => {
			navigate({
				search: (prev) => {
					if ((prev as T)[key] === value) return prev
					return { ...(prev as T), [key]: value }
				}
			} as NavigateFnOptions)
		},
		[navigate]
	)

	/**
	 * Remove search params from URL
	 * @param { (keyof T)[] } key
	 * @returns {Promise<void>}
	 */
	const removeParam = useCallback(
		(...key: Array<keyof T>) => {
			navigate({
				search: (prev) => {
					const next = { ...(prev as T) }
					let changed = false
					key.forEach((item) => {
						if (item in next) changed = true
						delete next[item]
					})
					return changed ? next : prev
				}
			} as NavigateFnOptions)
		},
		[navigate]
	)

	const removeAllParams = useCallback(() => {
		navigate({
			search: (prev) => (Object.keys(prev).length ? {} : prev)
		} as unknown as NavigateFnOptions)
	}, [navigate])

	useLayoutEffect(() => {
		const defaults = defaultParamsRef.current
		if (!defaults) return
		const defaultKeys = Object.keys(defaults)
		if (!defaultKeys.length) return

		navigate({
			search: (prev) => {
				if (defaultKeys.every((key) => key in prev)) return prev
				return { ...defaults, ...prev }
			}
		} as NavigateFnOptions)
	}, [navigate])

	return {
		searchParams: search,
		setParams,
		setParam,
		removeParam,
		removeAllParams
	}
}
