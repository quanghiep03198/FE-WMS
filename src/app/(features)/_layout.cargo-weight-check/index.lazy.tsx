import { useBreadcrumbContext } from '@/app/(features)/-contexts/breadcrumb-context'
import { RoleGuard } from '@/components/guards/role-guard'
import { UserRole } from '@common/constants/enums'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import DatePickerFilter from '../../../components/shared/date-picker-filter'
import {
	PageAction,
	PageDescription,
	PageHeader,
	PageSeparator,
	PageTitle,
	PageWrapper
} from '../../../components/shared/page'
import ReportMasterTable from './-components/report-master-table'

export const Route = createLazyFileRoute('/(features)/_layout/cargo-weight-check/')({
	component: Page
})

function Page() {
	const { t, i18n } = useTranslation()

	// Set page breadcrumb navigation
	const { setBreadcrumb } = useBreadcrumbContext()

	useEffect(() => {
		setBreadcrumb([{ to: '/cargo-weight-check', text: t('ns_common:navigation.cargo_weight_check') }])
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
					<PageHeader className='flex-1'>
						<PageTitle>{t('ns_packing:titles.daily_weighing_report')}</PageTitle>
						<PageDescription>{t('ns_packing:descriptions.daily_weighing_report')}</PageDescription>
						<PageAction>
							<DatePickerFilter />
						</PageAction>
					</PageHeader>
					<PageSeparator />
					<ReportMasterTable />
				</PageWrapper>
			</RoleGuard>
		</Fragment>
	)
}
