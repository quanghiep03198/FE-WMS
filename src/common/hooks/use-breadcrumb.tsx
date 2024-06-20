import { BreadcrumbContext, TBreadcrumb } from '@/components/providers/breadcrumbs-provider'
import { useContext, useEffect } from 'react'

export function useBreadcrumb(breadcrumbs: TBreadcrumb[]) {
	const { setBreadcrumb } = useContext(BreadcrumbContext)

	useEffect(() => setBreadcrumb(breadcrumbs), [])
}
