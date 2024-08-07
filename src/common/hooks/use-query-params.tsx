import { useNavigate, useSearch } from '@tanstack/react-router'
import { useDeepCompareEffect } from 'ahooks'
import _ from 'lodash'
import { useCallback } from 'react'

export default function useQueryParams<T extends Record<string, any>>(defaultParams?: T) {
	const navigate = useNavigate()

	const searchParams = useSearch({
		strict: false,
		select: (search: T) => search
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
		if (defaultParams) navigate({ search: { ...defaultParams, ...searchParams } })
	}, [])

	return {
		searchParams,
		setParams,
		removeParam
	}
}
