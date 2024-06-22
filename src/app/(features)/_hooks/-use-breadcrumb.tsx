import { useContext, useEffect } from 'react'
import { BreadcrumbContext, TBreadcrumb } from '../_components/_providers/-breadcrumb-provider'

export function useBreadcrumb(breadcrumbs: TBreadcrumb[]) {
	const { setBreadcrumb } = useContext(BreadcrumbContext)

	useEffect(() => setBreadcrumb(breadcrumbs), [])
}
