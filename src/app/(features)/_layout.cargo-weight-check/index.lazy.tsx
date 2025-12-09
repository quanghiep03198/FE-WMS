import { useBreadcrumbContext } from '@/app/(features)/-contexts/breadcrumb-context'
import { Div, Separator } from '@/components/ui'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import DatePickerFilter from '../-components/shared/date-picker-filter'
import { PageDescription, PageHeader, PageTitle } from '../-components/shared/page-header'
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

			<Div as='section' className='mt-4 space-y-4'>
				<Div className='flex w-full'>
					<PageHeader className='flex-1'>
						<PageTitle>{t('ns_packing:titles.daily_weighing_report')}</PageTitle>
						<PageDescription>{t('ns_packing:descriptions.daily_weighing_report')}</PageDescription>
					</PageHeader>
					<Div className='ml-auto sm:hidden'>
						<DatePickerFilter />
					</Div>
				</Div>
				<Separator />
				<ReportMasterTable />
			</Div>
		</Fragment>
	)
}
