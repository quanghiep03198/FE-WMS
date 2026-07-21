import { RoleGuard } from '@/components/guards/role-guard'
import { UserRole } from '@common/constants/enums'
import { PageAction, PageDescription, PageHeader, PageSeparator, PageTitle, PageWrapper } from '@components/shared/page'
import DownloadExcelButton from '@features/defective-goods/components/defective-goods-inventory/download-excel-button'
import DefectiveGoodsInventoryTable from '@features/defective-goods/components/defective-goods-inventory/report-table'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useBreadcrumbContext } from '../../../../contexts/breadcrumb-context'

export const Route = createLazyFileRoute('/(features)/_layout/(defective-goods)/defective-goods-inventory')({
	component: Page
})

function Page() {
	const { t, i18n } = useTranslation()
	// Set page breadcrumb navigation
	const { setBreadcrumb } = useBreadcrumbContext()

	useEffect(() => {
		setBreadcrumb([
			{
				to: '/defective-goods-inventory',
				text: t('ns_common:navigation.defective_goods_inventory')
			}
		])
	}, [i18n.language])

	return (
		<Fragment>
			<title>{t('ns_common:navigation.defective_goods_inventory')}</title>
			<meta name='description' content={t('ns_inoutbound:description.defective_goods_inventory_report')} />

			<RoleGuard
				authorizedRoles={[
					UserRole.ADMIN,
					UserRole.MANAGER,
					UserRole.DG_WAREHOUSE_STAFF,
					UserRole.INDUSTRIAL_ENGINEERING_STAFF
				]}>
				<PageWrapper>
					<PageHeader>
						<PageTitle>{t('ns_inoutbound:titles.defective_goods_inventory_report')}</PageTitle>
						<PageDescription>{t('ns_inoutbound:description.defective_goods_inventory_report')}</PageDescription>
						<PageAction>
							<DownloadExcelButton />
						</PageAction>
					</PageHeader>
					<PageSeparator />
					<DefectiveGoodsInventoryTable />
				</PageWrapper>
			</RoleGuard>
		</Fragment>
	)
}
