import { Div, Separator } from '@/components/ui'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { PageDescription, PageHeader, PageTitle } from '../-components/-shared/page-header'
import { useBreadcrumbContext } from '../-contexts/breadcrumb-context'
import ReportMasterTable from './-components/data-table'
import DownloadExcelButton from './-components/download-excel-button'

export const Route = createLazyFileRoute('/(features)/_layout/packing-manifest/')({
	component: Page
})

function Page() {
	const { t, i18n } = useTranslation()

	// Set page breadcrumb navigation
	const { setBreadcrumb } = useBreadcrumbContext()

	useEffect(() => {
		setBreadcrumb([{ to: '/packing-manifest', text: t('ns_common:navigation.packing_manifest') }])
	}, [i18n.language])

	return (
		<Fragment>
			<title>{t('ns_common:navigation.cargo_weight_check')}</title>
			<meta name='description' content={t('ns_packing:descriptions.daily_weighing_report')} />

			<Div as='section' className='mt-4 space-y-4'>
				<Div className='flex w-full'>
					<PageHeader className='flex-1'>
						<PageTitle>{t('ns_packing:titles.packing_manifest')}</PageTitle>
						<PageDescription>{t('ns_packing:descriptions.packing_manifest')}</PageDescription>
					</PageHeader>
					<Div className='ml-auto'>
						<DownloadExcelButton />
					</Div>
				</Div>
				<Separator />
				<ReportMasterTable />
			</Div>
		</Fragment>
	)
}
