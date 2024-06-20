import FallbackPage from '@/app/_components/_errors/-fallback-page'
import { useBreadcrumb } from '@/common/hooks/use-breadcrumb'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export const Route = createLazyFileRoute('/(features)/_layout/report/')({
	component: Page
})

function Page() {
	const { t } = useTranslation()
	useBreadcrumb([{ href: '/dashboard', title: t('ns_common:navigation.wh_report_management') }])

	return <FallbackPage />
}
