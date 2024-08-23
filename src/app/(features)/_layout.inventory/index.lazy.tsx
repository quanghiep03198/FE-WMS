import { useBreadcrumbContext } from '@/app/(features)/_contexts/-breadcrumb-context'
import UnavailableService from '@/app/_components/_errors/-unavailable-service'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export const Route = createLazyFileRoute('/(features)/_layout/inventory/')({
	component: Page
})

function Page() {
	const { t, i18n } = useTranslation()

	// Set page breadcrumb
	const { setBreadcrumb } = useBreadcrumbContext()

	useEffect(() => {
		setBreadcrumb([{ to: '/inventory', text: t('ns_common:navigation.inventory_management') }])
	}, [i18n.language])

	return <UnavailableService />
}
