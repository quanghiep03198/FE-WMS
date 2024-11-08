import { useBreadcrumbContext } from '@/app/(features)/_contexts/-breadcrumb-context'
import UnavailableService from '@/app/_components/_errors/-unavailable-service'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'

export const Route = createLazyFileRoute('/(features)/_layout/product-incoming-inspection/')({
	component: Page
})

function Page() {
	const { t, i18n } = useTranslation()

	// Set page breadcrumb navigation
	const { setBreadcrumb } = useBreadcrumbContext()

	useEffect(() => {
		setBreadcrumb([
			{ to: '/product-incoming-inspection', text: t('ns_common:navigation.production_incoming_inspection') }
		])
	}, [i18n.language])

	return (
		<Fragment>
			<Helmet title={t('ns_common:navigation.production_incoming_inspection')} />
			<UnavailableService />
		</Fragment>
	)
}
