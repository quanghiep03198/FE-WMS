import FallbackPage from '@/app/_components/_errors/-fallback-page'
import { Fragment } from 'react'
import { useBreadcrumb } from '@/app/(features)/_hooks/-use-breadcrumb'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet'
import { createColumnHelper } from '@tanstack/react-table'

export const Route = createLazyFileRoute('/(features)/_layout/product-incoming-inspection/')({
	component: Page
})

function Page() {
	const { t } = useTranslation()
	useBreadcrumb([
		{ to: '/product-incoming-inspection', text: t('ns_common:navigation.production_incoming_inspection') }
	])

	const columnHelper = createColumnHelper()

	return (
		<Fragment>
			<Helmet title={t('ns_common:navigation.production_incoming_inspection')} />
		</Fragment>
	)
}
