import { useBreadcrumbContext } from '@/app/(features)/-contexts/breadcrumb-context'
import { Div, Separator } from '@/components/ui'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { PageDescription, PageHeader, PageTitle } from '../-components/-shared/page-header'
import DatePickerFilter from './-components/date-picker-filter'
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

			<Div as='section' className='mt-4 space-y-4'>
				<Div className='flex w-full'>
					<PageHeader className='flex-1'>
						<PageTitle>{t('ns_inoutbound:titles.daily_outbound_report')}</PageTitle>
						<PageDescription>{t('ns_inoutbound:description.daily_outbound_report')}</PageDescription>
					</PageHeader>
					<Div className='ml-auto sm:hidden'>
						<DatePickerFilter />
					</Div>
				</Div>
				<Separator />
				<ReportDatalist />
			</Div>
		</Fragment>
	)
}
