import FallbackPage from '@/app/_components/_errors/-fallback-page'
import { useBreadcrumb } from '@/app/(features)/_hooks/-use-breadcrumb'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export const Route = createLazyFileRoute('/(features)/_layout/warehouse-import/')({
	component: Page
})

function Page() {
	const { t } = useTranslation()
	useBreadcrumb([{ to: '/warehouse-import', text: t('ns_common:navigation.import_management') }])

	return <FallbackPage />
}
