import FallbackPage from '@/app/_components/_errors/-fallback-page'
import { useBreadcrumb } from '@/common/hooks/use-breadcrumb'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

export const Route = createLazyFileRoute('/(features)/_layout/warehouse-export/')({
	component: Page
})

function Page() {
	const { t } = useTranslation()
	useBreadcrumb([{ href: '/product-incoming-inspection', title: t('ns_common:navigation.wh_export_management') }])

	return <FallbackPage />
}
