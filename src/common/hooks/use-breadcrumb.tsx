import { BreadcrumbContext, TBreadcrumb } from '@/components/providers/breadcrumbs-provider'
import { useRouterState } from '@tanstack/react-router'
import { useContext, useEffect } from 'react'

export function useBreadcrumb(breadcrumbs: TBreadcrumb[]) {
	const { setBreadcrumb } = useContext(BreadcrumbContext)
	const router = useRouterState()

	useEffect(() => setBreadcrumb(breadcrumbs), [router.location])
}
