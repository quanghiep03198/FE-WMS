// #region Modules
import { useBreadcrumbContext } from '@/app/(features)/-contexts/breadcrumb-context'
import { RoleGuard } from '@/app/-components/-guard/role-guard'
import { UserRole } from '@/common/constants/enums'
import { Div, Separator } from '@/components/ui'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import WarehouseFormDialog from './-components/warehouse-form'
import WarehouseList from './-components/warehouse-list'
import WarehouseListHeading from './-components/warehouse-list-heading'
import { PageProvider } from './-contexts/page-context'
// #endregion

// #region Router declaration
export const Route = createLazyFileRoute('/(features)/_layout/warehouse/')({
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

			<RoleGuard authorizedRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.FG_WAREHOUSE_STAFF]}>
				<PageProvider>
					<Div className='mt-4 space-y-6'>
						<WarehouseListHeading />
						<Separator />
						<WarehouseList />
					</Div>
					<WarehouseFormDialog />
				</PageProvider>
			</RoleGuard>
		</Fragment>
	)
}
