import { useLayoutStore } from '@/app/(features)/_stores/layout.store'
import UnavailableService from '@/app/_components/_errors/-unavailable-service'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export const Route = createLazyFileRoute('/(features)/_layout/inventory/')({
	component: Page
})

function Page() {
	const { t } = useTranslation()

	// Set page breadcrumb
	const setBreadcrumb = useLayoutStore((state) => state.setBreadcrumb)
	setBreadcrumb([{ to: '/inventory', text: t('ns_common:navigation.inventory_management') }])

	return <UnavailableService />
}
