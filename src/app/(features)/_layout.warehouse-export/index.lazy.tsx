import FallbackPage from '@/app/_components/_errors/-fallback-page'
import { useBreadcrumb } from '@/app/(features)/_hooks/-use-breadcrumb'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export const Route = createLazyFileRoute('/(features)/_layout/warehouse-export/')({
	component: Page
})

function Page() {
	const { t } = useTranslation()
	useBreadcrumb([{ to: '/warehouse-export', text: t('ns_common:navigation.export_management') }])

	return <FallbackPage />
}
