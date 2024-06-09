import { useNavigate, useSearch } from '@tanstack/react-router'
import _ from 'lodash'
import qs from 'qs'
import { useMemo } from 'react'

export default function useQueryParams(fallbackParams?: Record<string, any>) {
	const params = useSearch({
		strict: false,
		select: (search) => Object.fromEntries(new URLSearchParams(qs.stringify(search)))
	})

	const searchParams = useMemo(() => {
		const fallback = fallbackParams ?? params
		return Object.keys(params).length === 0 && Object.keys(fallback).length > 0 ? fallback : params
	}, [params, fallbackParams])

	const navigate = useNavigate()

	const setParams = (params: Record<string, any>) => navigate({ search: (prev) => ({ ...prev, ...params }) })

	const removeParam = (key: string) => navigate({ search: (prev) => _.omit(prev, [key]) })

	return { searchParams, setParams, removeParam }
}
