import { useBreadcrumbContext } from '@/app/(features)/-contexts/breadcrumb-context'
import { UserRole } from '@/common/constants/enums'
import HostCompatibleGuard from '@/components/guards/host-compatible-guard'
import { RoleGuard } from '@/components/guards/role-guard'
import { SocketProvider } from '@/stores/socket.store'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
	PageAction,
	PageDescription,
	PageHeader,
	PageSeparator,
	PageTitle,
	PageWrapper
} from '../-components/shared/page'
import { MonthPickerFilter } from './-components/month-picker-filter'
import { InventoryReportMasterTable } from './-components/report-master-table'

export const Route = createLazyFileRoute('/(features)/_layout/inventory-audit/')({
	component: Page
})

function Page() {
	const { t, i18n } = useTranslation()

	// Set page breadcrumb
	const { setBreadcrumb } = useBreadcrumbContext()

	useEffect(() => {
		setBreadcrumb([{ to: '/inventory-audit', text: t('ns_common:navigation.monthly_inventory_audit') }])
	}, [i18n.language])

	return (
		<Fragment>
			<title>{t('ns_common:navigation.monthly_inventory_audit')}</title>
			<meta name='description' content={t('ns_inoutbound:description.monthly_inventory_report')} />

			<RoleGuard
				authorizedRoles={[
					UserRole.ADMIN,
					UserRole.MANAGER,
					UserRole.FG_WAREHOUSE_STAFF,
					UserRole.INDUSTRIAL_ENGINEERING_STAFF
				]}>
				<HostCompatibleGuard>
					<SocketProvider namespace='/inventory'>
						<PageWrapper>
							<PageHeader className='flex-1'>
								<PageTitle>{t('ns_inoutbound:titles.monthly_inventory_report')}</PageTitle>
								<PageDescription>{t('ns_inoutbound:description.monthly_inventory_report')}</PageDescription>
								<PageAction>
									<MonthPickerFilter />
								</PageAction>
							</PageHeader>
							<PageSeparator />
							<InventoryReportMasterTable />
						</PageWrapper>
					</SocketProvider>
				</HostCompatibleGuard>
			</RoleGuard>
		</Fragment>
	)
}
