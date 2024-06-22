import { useNavigate, useRouter, useSearch } from '@tanstack/react-router'
import { useDeepCompareEffect } from 'ahooks'
import _ from 'lodash'
import { useCallback } from 'react'

export default function useQueryParams(defaultParams?: Record<string, any>) {
	const router = useRouter()

	const searchParams = useSearch({
		strict: false,
		select: (search) => search as Record<string, any>
	})
	/**
	 * Set search params from URL
	 * @param { Record<string, any> } params
	 * @returns {Promise<void>}
	 */
	const setParams = useCallback((params: Record<string, any>) => {
		router.invalidate().finally(() => router.navigate({ search: (prev) => ({ ...prev, ...params }) }))
	}, [])

	/**
	 * Remove search params from URL
	 * @param { string } key
	 * @returns {Promise<void>}
	 */
	const removeParam = useCallback((key: string) => {
		router.invalidate().finally(() => router.navigate({ search: (prev) => _.omit(prev, [key]) }))
	}, [])

	useDeepCompareEffect(() => {
		if (!Object.keys(searchParams).length && Boolean(defaultParams) && Object.keys(defaultParams).length > 0) {
			router.invalidate().finally(() => router.navigate({ search: defaultParams }))
		}
	}, [])

	return {
		searchParams,
		setParams,
		removeParam
	}
}
