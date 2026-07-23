import { UserRole } from '@common/constants/enums'
import { RoleGuard } from '@components/guards/role-guard'
import DatePickerFilter from '@components/shared/date-picker-filter'
import { PageAction, PageDescription, PageHeader, PageSeparator, PageTitle, PageWrapper } from '@components/shared/page'
import { useBreadcrumbContext } from '@contexts/breadcrumb-context'
import ReportDatalist from '@features/report/components/finished-goods-outbound/report-master-table'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export const Route = createLazyFileRoute('/(features)/_layout/outbound-report')({
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

			<RoleGuard
				authorizedRoles={[
					UserRole.ADMIN,
					UserRole.MANAGER,
					UserRole.FG_WAREHOUSE_STAFF,
					UserRole.INDUSTRIAL_ENGINEERING_STAFF
				]}>
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
