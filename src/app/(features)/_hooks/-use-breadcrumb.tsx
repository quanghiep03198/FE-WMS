import { useContext, useEffect } from 'react'
import { BreadcrumbContext, TBreadcrumb } from '../_components/_providers/-breadcrumb-provider'
import { useRouterState } from '@tanstack/react-router'

export function useBreadcrumb(data: TBreadcrumb[]) {
	const { setBreadcrumb } = useContext(BreadcrumbContext)
	const router = useRouterState()

	useEffect(() => setBreadcrumb(data), [router])
}
