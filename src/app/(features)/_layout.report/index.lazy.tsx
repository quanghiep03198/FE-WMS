import UnavailableService from '@/app/_components/_errors/-unavailable-service'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useBreadcrumbContext } from '../_contexts/-breadcrumb-context'

export const Route = createLazyFileRoute('/(features)/_layout/report/')({
	component: Page
})

function Page() {
	const { t, i18n } = useTranslation()

	// Set page breadcrumb navigation
	const { setBreadcrumb } = useBreadcrumbContext()

	useEffect(() => {
		setBreadcrumb([{ to: '/warehouse-export', text: t('ns_common:navigation.report_management') }])
	}, [i18n.language])

	return <UnavailableService />
}
