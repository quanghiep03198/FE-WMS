// #region Modules
import { WarehouseService } from '@/features/warehouse/services/warehouse.service'
import { UserRole } from '@common/constants/enums'
import { RoleGuard } from '@components/guards/role-guard'
import { PageSeparator, PageWrapper } from '@components/shared/page'
import { useBreadcrumbContext } from '@contexts/breadcrumb-context'
import PageHeading from '@features/warehouse/components/storage-location/page-heading'
import StorageList from '@features/warehouse/components/storage-location/storage-data-table'
import WarehouseStorageFormDialog from '@features/warehouse/components/storage-location/storage-form'
import { PageProvider } from '@features/warehouse/contexts/page-context'
import { WarehouseQueryKeys } from '@features/warehouse/hooks/use-warehouse-request'
import { getWarehouseStorageOptions } from '@features/warehouse/hooks/use-warehouse-storage-request'
import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute, useParams } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
// #endregion

// #region Router declaration
export const Route = createLazyFileRoute('/(features)/_layout/(warehouse)/warehouse/$warehouseNum')({
	component: Page
})
// #endregion

// #region Page component
function Page() {
	const { t, i18n } = useTranslation(['ns_common'])
	const { warehouseNum } = useParams({ strict: false })

	// Set page breadcrumb navigation
	const { setBreadcrumb } = useBreadcrumbContext()

	useEffect(() => {
		setBreadcrumb([
			{
				text: t('ns_common:navigation.warehouse_management'),
				to: '/warehouse'
			},
			{
				text: t('ns_common:navigation.storage_detail'),
				to: '/warehouse/$warehouseNum',
				params: warehouseNum
			},
			{
				text: warehouseNum,
				to: '/warehouse/$warehouseNum',
				params: warehouseNum
			}
		])
	}, [i18n.language])

	const warehouseStorageQueryResult = useQuery(
		getWarehouseStorageOptions(warehouseNum, { select: (response) => response.metadata })
	)

	const warehouseDetailQueryResult = useQuery({
		queryKey: [WarehouseQueryKeys.WAREHOUSE, warehouseNum],
		queryFn: () => WarehouseService.getWarehouseByNum(warehouseNum),
		select: (response) => response.metadata
	})

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
				<PageProvider>
					<PageWrapper>
						<PageHeading />
						<PageSeparator />
						<StorageList {...warehouseStorageQueryResult} />
					</PageWrapper>
					<WarehouseStorageFormDialog {...warehouseDetailQueryResult} />
				</PageProvider>
			</RoleGuard>
		</Fragment>
	)
}
