import { useNavigate, useRouter, useSearch } from '@tanstack/react-router'
import { useDeepCompareEffect } from 'ahooks'
import _ from 'lodash'
import { useCallback } from 'react'

export default function useQueryParams(defaultParams?: Record<string, any>) {
	const router = useRouter()
	const navigate = useNavigate()

	const searchParams = useSearch({
		strict: false,
		select: (): Record<string, any> => Object.fromEntries(new URLSearchParams(window.location.search))
	})

	/**
	 * Set search params from URL
	 * @param { Record<string, any> } params
	 * @returns {Promise<void>}
	 */
	const setParams = useCallback((params: Record<string, any>) => {
		navigate({ search: (prev) => ({ ...prev, ...params }) })
	}, [])

	/**
	 * Remove search params from URL
	 * @param { string } key
	 * @returns {Promise<void>}
	 */
	const removeParam = useCallback((key: string) => {
		navigate({ search: (prev) => _.omit(prev, [key]) })
	}, [])

	useDeepCompareEffect(() => {
		if (!Object.keys(searchParams).length && Boolean(defaultParams) && Object.keys(defaultParams).length > 0) {
			router.invalidate().finally(() => navigate({ search: defaultParams }))
		}
	}, [])

	return {
		searchParams,
		setParams,
		removeParam
	}
}
