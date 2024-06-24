import { useBreadcrumb } from '@/app/(features)/_hooks/-use-breadcrumb'
import FallbackPage from '@/app/_components/_errors/-fallback-page'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export const Route = createLazyFileRoute('/(features)/_layout/inventory/')({
	component: Page
})

function Page() {
	const { t } = useTranslation()
	useBreadcrumb([{ to: '/inventory', text: t('ns_common:navigation.inventory_management') }])

	return <FallbackPage />
}
