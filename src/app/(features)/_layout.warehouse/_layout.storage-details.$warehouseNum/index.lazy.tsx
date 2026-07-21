// #region Modules
import { RoleGuard } from '@/components/guards/role-guard'
import { useBreadcrumbContext } from '@/contexts/breadcrumb-context'
import { WarehouseService } from '@/services/warehouse.service'
import { UserRole } from '@common/constants/enums'
import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute, useParams } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { PageProvider } from '../-contexts/page-context'
import { WarehouseQueryKeys } from '../-hooks/use-warehouse-asm'
import { getWarehouseStorageOptions } from '../-hooks/use-warehouse-storage-asm'
import { PageSeparator, PageWrapper } from '../../../../components/shared/page'
import PageHeading from './-components/page-heading'
import StorageList from './-components/storage-data-table'
import WarehouseStorageFormDialog from './-components/storage-form'
// #endregion

// #region Router declaration
export const Route = createLazyFileRoute('/(features)/_layout/warehouse/_layout/storage-details/$warehouseNum/')({
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
				to: '/warehouse/storage-details/$warehouseNum',
				params: warehouseNum
			},
			{
				text: warehouseNum,
				to: '/warehouse/storage-details/$warehouseNum',
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
