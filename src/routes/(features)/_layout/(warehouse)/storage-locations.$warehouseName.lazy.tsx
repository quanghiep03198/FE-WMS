// #region Modules
import { UserRole } from '@common/constants/enums'
import { RoleGuard } from '@components/guards/role-guard'
import { PageSeparator, PageWrapper } from '@components/shared/page'
import { useBreadcrumbContext } from '@contexts/breadcrumb-context'
import CreateLocationFormDialog from '@features/warehouse/components/storage-location/create-location-form-dialog'
import PageHeading from '@features/warehouse/components/storage-location/page-heading'
import StorageList from '@features/warehouse/components/storage-location/storage-data-table'
import UpdateLocationFormDialog from '@features/warehouse/components/storage-location/update-location-form-dialog'
import { StorageLocationPageProvider } from '@features/warehouse/contexts/storage-location-page-context'
import { useGetOneWarehouseQuery } from '@features/warehouse/hooks/use-warehouse-request'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
// #endregion

// #region Router declaration
export const Route = createLazyFileRoute('/(features)/_layout/(warehouse)/storage-locations/$warehouseName')({
	component: Page
})
// #endregion

// #region Page component
function Page() {
	const { t, i18n } = useTranslation()

	const warehouseName = Route.useParams({ select: (params) => params.warehouseName })

	// Set page breadcrumb navigation
	const { setBreadcrumb } = useBreadcrumbContext()

	useEffect(() => {
		setBreadcrumb([
			{
				text: t('ns_common:navigation.warehouse_management'),
				to: '/warehouses'
			},
			{
				text: warehouseName!,
				to: '/storage-locations/$warehouseName',
				params: { warehouseName }
			},
			{
				text: t('ns_common:navigation.storage_locations'),
				to: '/storage-locations/$warehouseName',
				params: { warehouseName }
			}
		])
	}, [i18n.language])

	const { data } = useGetOneWarehouseQuery(warehouseName)

	return (
		<Fragment>
			<title>{t('ns_common:navigation.warehouse_management')}</title>
			<meta name='description' content={t('ns_warehouse:headings.storage_list_description')} />

			<RoleGuard
				authorizedRoles={[
					UserRole.ADMIN,
					UserRole.MANAGER,
					UserRole.FG_WAREHOUSE_STAFF,
					UserRole.INDUSTRIAL_ENGINEERING_STAFF
				]}>
				<StorageLocationPageProvider>
					<PageWrapper>
						<PageHeading />
						<PageSeparator />
						<StorageList />
					</PageWrapper>
					<CreateLocationFormDialog data={data!} />
					<UpdateLocationFormDialog />
				</StorageLocationPageProvider>
			</RoleGuard>
		</Fragment>
	)
}
