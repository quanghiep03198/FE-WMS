import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'

import UnavailableService from '@/app/_components/_errors/-unavailable-service'
import { useBreadcrumbContext } from '../_contexts/-breadcrumb-context'

export const Route = createLazyFileRoute('/(features)/_layout/transfer-management/')({
	component: Page
})

function Page() {
	const { t, i18n } = useTranslation()
	const { setBreadcrumb } = useBreadcrumbContext()

	useEffect(() => {
		setBreadcrumb([{ to: '/transfer-management', text: t('ns_common:navigation.transfer_managment') }])
	}, [i18n.language])

	return (
		<Fragment>
			<Helmet title={t('ns_common:navigation.transfer_managment')} />
			<UnavailableService />
		</Fragment>
	)
}
