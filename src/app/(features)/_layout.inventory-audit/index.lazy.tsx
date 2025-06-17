import { useBreadcrumbContext } from '@/app/(features)/-contexts/breadcrumb-context'
import { Div, Separator } from '@/components/ui'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { PageDescription, PageHeader, PageTitle } from '../-components/-shared/page-header'
import { MonthPickerFilter } from './-components/month-picker-filter'
import { InventoryReportMasterTable } from './-components/report-master-table'

export const Route = createLazyFileRoute('/(features)/_layout/inventory-audit/')({
	component: Page
})

function Page() {
	const { t, i18n } = useTranslation()

	// Set page breadcrumb
	const { setBreadcrumb } = useBreadcrumbContext()

	useEffect(() => {
		setBreadcrumb([{ to: '/inventory-audit', text: t('ns_common:navigation.monthly_inventory_audit') }])
	}, [i18n.language])

	return (
		<Fragment>
			<title>{t('ns_common:navigation.monthly_inventory_audit')}</title>
			<meta name='description' content={t('ns_inoutbound:description.monthly_inventory_report')} />

			<Div as='section' className='mt-4 space-y-4'>
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
