import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import UnavailableService from '@/app/-components/-errors/unavailable-service'
import { useBreadcrumbContext } from '../-contexts/breadcrumb-context'

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
			<title>{t('ns_common:navigation.transfer_managment')}</title>

			<UnavailableService />
		</Fragment>
	)
}
