import { Div, Separator } from '@/components/ui'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { PageDescription, PageHeader, PageTitle } from '../../-components/-shared/page-header'
import { useBreadcrumbContext } from '../../-contexts/breadcrumb-context'
import DownloadExcelButton from './-components/download-excel-button'
import DefectiveGoodsInventoryTable from './-components/report-table'

export const Route = createLazyFileRoute('/(features)/_layout/(defective-goods)/defective-goods-inventory/')({
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
				text: t('ns_common:navigation.defective_goods_inventory')
			}
		])
	}, [i18n.language])

	return (
		<Fragment>
			<title>{t('ns_common:navigation.defective_goods_inventory')}</title>
			<meta name='description' content={t('ns_inoutbound:description.defective_goods_inventory_report')} />

			<Div as='section' className='mt-4 space-y-4 @container'>
				<Div className='flex w-full justify-between'>
					<PageHeader className='flex-1'>
						<PageTitle>{t('ns_inoutbound:titles.defective_goods_inventory_report')}</PageTitle>
						<PageDescription>{t('ns_inoutbound:description.defective_goods_inventory_report')}</PageDescription>
					</PageHeader>
					<DownloadExcelButton />
				</Div>
				<Separator />
				<DefectiveGoodsInventoryTable />
			</Div>
		</Fragment>
	)
}
