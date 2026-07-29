// #region Modules
import { UserRole } from '@common/constants/enums'
import { RoleGuard } from '@components/guards/role-guard'
import { useBreadcrumbContext } from '@contexts/breadcrumb-context'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { PageSeparator, PageWrapper } from '../../../../components/shared/page'
import PageHeading from '../../../../features/warehouse/components/warehouse/page-heading'
import WarehouseDataTable from '../../../../features/warehouse/components/warehouse/warehouse-data-table'
import WarehouseFormDialog from '../../../../features/warehouse/components/warehouse/warehouse-form'
import { PageProvider } from '../../../../features/warehouse/contexts/page-context'
// #endregion

// #region Router declaration
export const Route = createLazyFileRoute('/(features)/_layout/(warehouse)/warehouse')({
	component: Page
})
// #endregion

// #region Page component
function Page() {
	const { t, i18n } = useTranslation()

	// Set page breadcrumb navigation
	const { setBreadcrumb } = useBreadcrumbContext()

	useEffect(() => {
		setBreadcrumb([{ to: '/warehouse', text: t('ns_common:navigation.warehouse_management') }])
	}, [i18n.language])

	return (
		<Fragment>
			<title>{t('ns_common:navigation.warehouse_management')}</title>
			<meta name='description' content={t('ns_warehouse:headings.warehouse_list_description')} />

			<RoleGuard
				authorizedRoles={[
					UserRole.ADMIN,
					UserRole.MANAGER,
					UserRole.FG_WAREHOUSE_STAFF,
					UserRole.INDUSTRIAL_ENGINEERING_STAFF
				]}>
				<PageProvider>
					<PageWrapper>
						<PageHeading />
						<PageSeparator />
						<WarehouseDataTable />
					</PageWrapper>
					<WarehouseFormDialog />
				</PageProvider>
			</RoleGuard>
		</Fragment>
	)
}
