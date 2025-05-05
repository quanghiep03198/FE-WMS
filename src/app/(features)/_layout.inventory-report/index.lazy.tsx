import { useBreadcrumbContext } from '@/app/(features)/_contexts/-breadcrumb-context'
import { Div, Separator } from '@/components/ui'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { PageDescription, PageHeader, PageTitle } from '../_components/_shared/-page-header'
import { MonthPickerFilter } from './_components/-month-picker-filter'
import { InventoryReportMasterTable } from './_components/-report-master-table'

export const Route = createLazyFileRoute('/(features)/_layout/inventory-report/')({
	component: Page
})

function Page() {
	const { t, i18n } = useTranslation()

	// Set page breadcrumb
	const { setBreadcrumb } = useBreadcrumbContext()

	useEffect(() => {
		setBreadcrumb([{ to: '/inventory-report', text: t('ns_common:navigation.inventory_management') }])
	}, [i18n.language])

	return (
		<Fragment>
			<title>{t('ns_common:navigation.inventory_management')}</title>
			<meta name='description' content={t('ns_inoutbound:description.monthly_inventory_report')} />

			<Div as='section' className='space-y-4'>
				<Div className='flex w-full'>
					<PageHeader className='flex-1'>
						<PageTitle>{t('ns_inoutbound:titles.monthly_inventory_report')}</PageTitle>
						<PageDescription>{t('ns_inoutbound:description.monthly_inventory_report')}</PageDescription>
					</PageHeader>
					<Div className='ml-auto sm:hidden'>
						<MonthPickerFilter />
					</Div>
				</Div>
				<Separator />
				<InventoryReportMasterTable />
			</Div>
		</Fragment>
	)
}
