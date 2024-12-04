import { useNavigate, UseNavigateResult, useSearch } from '@tanstack/react-router'
import { omit } from 'lodash'
import { useCallback, useEffect } from 'react'

type NavigateFnOptions = Parameter<UseNavigateResult<string>>

export default function useQueryParams<T extends Record<string, any>>(defaultParams?: T) {
	const navigate = useNavigate()

	const searchParams = useSearch({
		strict: false,
		structuralSharing: false,
		select: (search) => search
	})
	/**
	 * Set search params from URL
	 * @param { Record<string, any> } params
	 * @returns {Promise<void>}
	 */
	const setParams = useCallback((params: Record<string, any>) => {
		navigate({ search: (prev) => ({ ...prev, ...params }) } as NavigateFnOptions)
	}, [])

	/**
	 * Remove search params from URL
	 * @param { string } key
	 * @returns {Promise<void>}
	 */
	const removeParam = useCallback((key: string) => {
		navigate({ search: (prev) => omit(prev, [key]) } as NavigateFnOptions)
	}, [])

	useEffect(() => {
		if (defaultParams) navigate({ search: { ...defaultParams, ...searchParams } })
	}, [])

	return {
		searchParams,
		setParams,
		removeParam
	}
}
