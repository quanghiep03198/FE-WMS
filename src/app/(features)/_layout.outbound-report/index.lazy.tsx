import { useBreadcrumbContext } from '@/app/(features)/-contexts/breadcrumb-context'
import { RoleGuard } from '@/app/-components/-guard/role-guard'
import { UserRole } from '@/common/constants/enums'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import DatePickerFilter from '../-components/shared/date-picker-filter'
import {
	PageAction,
	PageDescription,
	PageHeader,
	PageSeparator,
	PageTitle,
	PageWrapper
} from '../-components/shared/page'
import ReportDatalist from './-components/report-master-table'

export const Route = createLazyFileRoute('/(features)/_layout/outbound-report/')({
	component: Page
})

function Page() {
	const { t, i18n } = useTranslation()

	// Set page breadcrumb navigation
	const { setBreadcrumb } = useBreadcrumbContext()

	useEffect(() => {
		setBreadcrumb([
			{
				to: '/outbound-report',
				text: t('ns_common:navigation.daily_outbound_report')
			}
		])
	}, [i18n.language])

	return (
		<Fragment>
			<title>{t('ns_common:navigation.daily_outbound_report')}</title>
			<meta name='description' content={t('ns_inoutbound:description.daily_outbound_report')} />

			<RoleGuard authorizedRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.FG_WAREHOUSE_STAFF]}>
				<PageWrapper>
					<PageHeader>
						<PageTitle>{t('ns_inoutbound:titles.daily_outbound_report')}</PageTitle>
						<PageDescription>{t('ns_inoutbound:description.daily_outbound_report')}</PageDescription>
						<PageAction className='sm:hidden'>
							<DatePickerFilter />
						</PageAction>
					</PageHeader>
					<PageSeparator />
					<ReportDatalist />
				</PageWrapper>
			</RoleGuard>
		</Fragment>
	)
}
