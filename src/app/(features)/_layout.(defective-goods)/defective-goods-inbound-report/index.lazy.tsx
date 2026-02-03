import { useBreadcrumbContext } from '@/app/(features)/-contexts/breadcrumb-context'
import { RoleGuard } from '@/app/-components/-guard/role-guard'
import { UserRole } from '@/common/constants/enums'
import { Div } from '@/components/ui'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import DatePickerFilter from '../../-components/shared/date-picker-filter'
import {
	PageAction,
	PageDescription,
	PageHeader,
	PageSeparator,
	PageTitle,
	PageWrapper
} from '../../-components/shared/page-header'
import DownloadExcelButton from './-components/download-excel-button'
import InboundReportMasterTable from './-components/report-master-table'

export const Route = createLazyFileRoute('/(features)/_layout/(defective-goods)/defective-goods-inbound-report/')({
	component: Page
})

function Page() {
	const { t, i18n } = useTranslation()
	// Set page breadcrumb navigation
	const { setBreadcrumb } = useBreadcrumbContext()

	useEffect(() => {
		setBreadcrumb([
			{
				to: '/defective-goods-inbound-report',
				text: t('ns_common:navigation.defective_goods_inbound_report')
			}
		])
	}, [i18n.language])

	return (
		<Fragment>
			<title>{t('ns_common:navigation.daily_inbound_report')}</title>
			<meta name='description' content={t('ns_inoutbound:description.defective_goods_inbound_report')} />

			<RoleGuard
				authorizedRoles={[
					UserRole.ADMIN,
					UserRole.MANAGER,
					UserRole.FG_WAREHOUSE_STAFF,
					UserRole.DG_WAREHOUSE_STAFF
				]}>
				<PageWrapper>
					<PageHeader>
						<PageTitle>{t('ns_inoutbound:titles.daily_inbound_report')}</PageTitle>
						<PageDescription>{t('ns_inoutbound:description.defective_goods_inbound_report')}</PageDescription>
						<PageAction>
							<DatePickerFilter />
							<Div className='hidden @[1024px]:block'>
								<DownloadExcelButton />
							</Div>
						</PageAction>
					</PageHeader>

					<PageSeparator />
					<InboundReportMasterTable />
				</PageWrapper>
			</RoleGuard>
		</Fragment>
	)
}
