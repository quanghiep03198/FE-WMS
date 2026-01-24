import { useBreadcrumbContext } from '@/app/(features)/-contexts/breadcrumb-context'
import { RoleGuard } from '@/app/-components/-guard/role-guard'
import { UserRole } from '@/common/constants/enums'
import { Div, Separator } from '@/components/ui'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import DatePickerFilter from '../../-components/shared/date-picker-filter'
import { PageDescription, PageHeader, PageTitle } from '../../-components/shared/page-header'
import DownloadExcelButton from './-components/download-excel-button'
import InboundReportMasterTable from './-components/report-master-table'

export const Route = createLazyFileRoute('/(features)/_layout/(defective-goods)/defective-goods-outbound-report/')({
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
				text: t('ns_common:navigation.defective_goods_outbound_report')
			}
		])
	}, [i18n.language])

	return (
		<Fragment>
			<title>{t('ns_common:navigation.defective_goods_outbound_report')}</title>
			<meta name='description' content={t('ns_inoutbound:description.defective_goods_outbound_report')} />

			<RoleGuard
				authorizedRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.WAREHOUSE_OFFICER, UserRole.QC_OFFICER]}>
				<Div as='section' className='mt-4 space-y-4 @container'>
					<Div className='flex w-full'>
						<PageHeader className='flex-1'>
							<PageTitle>{t('ns_inoutbound:titles.daily_outbound_report')}</PageTitle>
							<PageDescription>{t('ns_inoutbound:description.defective_goods_outbound_report')}</PageDescription>
						</PageHeader>
						<Div className='ml-auto flex gap-x-2'>
							<DatePickerFilter />
							<Div className='hidden @[1024px]:block'>
								<DownloadExcelButton />
							</Div>
						</Div>
					</Div>
					<Separator />
					<InboundReportMasterTable />
				</Div>
			</RoleGuard>
		</Fragment>
	)
}
