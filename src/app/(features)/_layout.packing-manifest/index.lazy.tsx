import { RoleGuard } from '@/components/guards/role-guard'
import { UserRole } from '@common/constants/enums'
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
} from '../../../components/shared/page'
import { useBreadcrumbContext } from '../../../contexts/breadcrumb-context'
import ReportMasterTable from './-components/data-table'
import DownloadExcelButton from './-components/download-excel-button'

export const Route = createLazyFileRoute('/(features)/_layout/packing-manifest/')({
	component: Page
})

function Page() {
	const { t, i18n } = useTranslation()

	// Set page breadcrumb navigation
	const { setBreadcrumb } = useBreadcrumbContext()

	useEffect(() => {
		setBreadcrumb([{ to: '/packing-manifest', text: t('ns_common:navigation.packing_manifest') }])
	}, [i18n.language])

	return (
		<Fragment>
			<title>{t('ns_common:navigation.cargo_weight_check')}</title>
			<meta name='description' content={t('ns_packing:descriptions.daily_weighing_report')} />

			<RoleGuard
				authorizedRoles={[
					UserRole.ADMIN,
					UserRole.MANAGER,
					UserRole.FG_WAREHOUSE_STAFF,
					UserRole.INDUSTRIAL_ENGINEERING_STAFF
				]}>
				<PageWrapper>
					<PageHeader>
						<PageTitle>{t('ns_packing:titles.packing_manifest')}</PageTitle>
						<PageDescription>{t('ns_packing:descriptions.packing_manifest')}</PageDescription>
						<PageAction>
							<DownloadExcelButton />
						</PageAction>
					</PageHeader>
					<PageSeparator />
					<ReportMasterTable />
				</PageWrapper>
			</RoleGuard>
		</Fragment>
	)
}
