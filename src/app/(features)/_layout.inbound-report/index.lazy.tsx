import { useBreadcrumbContext } from '@/app/(features)/-contexts/breadcrumb-context'
import { Div, Separator } from '@/components/ui'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { PageDescription, PageHeader, PageTitle } from '../-components/-shared/page-header'
import DatePickerFilter from './-components/date-picker-filter'
import DownloadExcelDropdown from './-components/download-excel-dropdown'
import InboundReportMasterTable from './-components/report-master-table'

export const Route = createLazyFileRoute('/(features)/_layout/inbound-report/')({
	component: Page
})

function Page() {
	const { t, i18n } = useTranslation()
	// Set page breadcrumb navigation
	const { setBreadcrumb } = useBreadcrumbContext()

	useEffect(() => {
		setBreadcrumb([
			{
				to: '/inbound-report',
				text: t('ns_common:navigation.import_management')
			}
		])
	}, [i18n.language])

	return (
		<Fragment>
			<title>{t('ns_common:navigation.import_management')}</title>
			<meta name='description' content={t('ns_inoutbound:description.daily_inbound_report')} />

			<Div as='section' className='mt-4 space-y-4 @container'>
				<Div className='flex w-full'>
					<PageHeader className='flex-1'>
						<PageTitle>{t('ns_inoutbound:titles.daily_inbound_report')}</PageTitle>
						<PageDescription>{t('ns_inoutbound:description.daily_inbound_report')}</PageDescription>
					</PageHeader>
					<Div className='ml-auto flex gap-x-2'>
						<DatePickerFilter />
						<Div className='hidden @[1024px]:block'>
							<DownloadExcelDropdown />
						</Div>
					</Div>
				</Div>
				<Separator />
				<InboundReportMasterTable />
			</Div>
		</Fragment>
	)
}
