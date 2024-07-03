import { useBreadcrumb } from '@/app/(features)/_hooks/-use-breadcrumb'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import IOOrderList from './_components/-io-order-list'

export const Route = createLazyFileRoute('/(features)/_layout/product-incoming-inspection/')({
	component: Page
})

function Page() {
	const { t } = useTranslation()
	useBreadcrumb([
		{ to: '/product-incoming-inspection', text: t('ns_common:navigation.production_incoming_inspection') }
	])

	return (
		<Fragment>
			<Helmet title={t('ns_common:navigation.production_incoming_inspection')} />
			<IOOrderList />
		</Fragment>
	)
}
