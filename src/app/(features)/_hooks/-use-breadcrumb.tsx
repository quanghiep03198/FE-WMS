import { useContext, useEffect } from 'react'
import { BreadcrumbContext, TBreadcrumb } from '../_components/_providers/-breadcrumb-provider'
import { useRouterState } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export function useBreadcrumb(data: TBreadcrumb[]) {
	const { setBreadcrumb } = useContext(BreadcrumbContext)
	const router = useRouterState()
	const { i18n } = useTranslation()

	useEffect(() => setBreadcrumb(data), [router, i18n.language])
}
