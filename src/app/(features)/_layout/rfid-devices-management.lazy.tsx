import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { UserRole } from '@common/constants/enums'
import HostCompatibleGuard from '@components/guards/host-compatible-guard'
import { RoleGuard } from '@components/guards/role-guard'
import { PageAction, PageDescription, PageHeader, PageSeparator, PageTitle, PageWrapper } from '@components/shared/page'
import { useBreadcrumbContext } from '@contexts/breadcrumb-context'
import DeviceDataTable from '@features/rfid-device/components/device-data-table'
import RFIDDeviceFormDialog from '@features/rfid-device/components/rfid-device-form-dialog'
import { PageContextProvider } from '@features/rfid-device/contexts/page-context'

export const Route = createLazyFileRoute('/(features)/_layout/rfid-devices-management')({
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
			<meta name='description' content={t('ns_rfid:descriptions.rfid_device_management')} />

			<RoleGuard authorizedRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.FG_WAREHOUSE_STAFF]}>
				<HostCompatibleGuard>
					<PageContextProvider>
						<PageWrapper>
							<PageHeader>
								<PageTitle>{t('ns_rfid:titles.rfid_device_management')}</PageTitle>
								<PageDescription>{t('ns_rfid:descriptions.rfid_device_management')}</PageDescription>
								<PageAction>
									<RFIDDeviceFormDialog />
								</PageAction>
							</PageHeader>
							<PageSeparator />
							<DeviceDataTable />
						</PageWrapper>
					</PageContextProvider>
				</HostCompatibleGuard>
			</RoleGuard>
		</Fragment>
	)
}
