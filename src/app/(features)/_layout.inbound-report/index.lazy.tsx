import { useBreadcrumbContext } from '@/app/(features)/_contexts/-breadcrumb-context'
import { Div, Separator } from '@/components/ui'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { PageDescription, PageHeader, PageTitle } from '../_components/_shared/-page-header'
import DatePickerFilter from './_components/-date-picker-filter'
import ReportDatalist from './_components/-report-datalist'

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
			<Helmet title={t('ns_common:navigation.import_management')} />
			<Div as='section' className='space-y-4'>
				<Div className='flex w-full'>
					<PageHeader className='flex-1'>
						<PageTitle>{t('ns_inoutbound:titles.daily_inbound_report')}</PageTitle>
						<PageDescription>{t('ns_inoutbound:description.daily_inbound_report')}</PageDescription>
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
