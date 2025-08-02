// #region Modules
import { useBreadcrumbContext } from '@/app/(features)/-contexts/breadcrumb-context'
import { Div, Separator } from '@/components/ui'
import { WarehouseService } from '@/services/warehouse.service'
import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute, useParams } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { PageProvider } from '../-contexts/page-context'
import { WarehouseQueryKeys } from '../-hooks/use-warehouse-asm'
import { getWarehouseStorageOptions } from '../-hooks/use-warehouse-storage-asm'
import WarehouseStorageFormDialog from './-components/storage-form'
import StorageListHeading from './-components/storage-heading'
import StorageList from './-components/storage-list'
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

			<PageProvider>
				<Div className='mt-4 space-y-6'>
					<StorageListHeading />
					<Separator />
					<StorageList {...warehouseStorageQueryResult} />
				</Div>
				<WarehouseStorageFormDialog {...warehouseDetailQueryResult} />
			</PageProvider>
		</Fragment>
	)
}
