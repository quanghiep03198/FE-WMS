import FallbackPage from '@/app/_components/_errors/-fallback-page'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useLayoutStore } from '@/app/(features)/_stores/-layout.store'

export const Route = createLazyFileRoute('/(features)/_layout/warehouse-export/')({
	component: Page
})

function Page() {
	const { t } = useTranslation()

	// Set page breadcrumb navigation
	const setBreadcrumb = useLayoutStore((state) => state.setBreadcrumb)
	setBreadcrumb([{ to: '/warehouse-export', text: t('ns_common:navigation.export_management') }])

	return <FallbackPage />
}
