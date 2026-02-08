import { RoleGuard } from '@/app/-components/-guard/role-guard'
import { UserRole } from '@/common/constants/enums'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
	PageAction,
	PageDescription,
	PageHeader,
	PageSeparator,
	PageTitle,
	PageWrapper
} from '../../-components/shared/page'
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

			<RoleGuard authorizedRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.DG_WAREHOUSE_STAFF]}>
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
