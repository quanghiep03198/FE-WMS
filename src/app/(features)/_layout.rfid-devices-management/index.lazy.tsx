import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { Div, Separator } from '@/components/ui'
import { PageDescription, PageHeader, PageTitle } from '../-components/-shared/page-header'
import { useBreadcrumbContext } from '../-contexts/breadcrumb-context'
import RFIDDeviceList from './-components/rfid-device-list'

export const Route = createLazyFileRoute('/(features)/_layout/rfid-devices-management/')({
	component: Page
})

function Page() {
	const { t, i18n } = useTranslation()
	const { setBreadcrumb } = useBreadcrumbContext()

	useEffect(() => {
		setBreadcrumb([{ to: '/rfid-devices-management', text: t('ns_common:navigation.rfid_device_management') }])
	}, [i18n.language])

	return (
		<Fragment>
			<title>{t('ns_common:navigation.rfid_device_management')}</title>

			<Div as='section' className='mt-4 space-y-6'>
				<PageHeader>
					<PageTitle>{t('ns_rfid:titles.rfid_device_management')}</PageTitle>
					<PageDescription>{t('ns_rfid:descriptions.rfid_device_management')}</PageDescription>
				</PageHeader>
				<Separator />
				<RFIDDeviceList />
			</Div>
		</Fragment>
	)
}
