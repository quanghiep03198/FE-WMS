// #region Modules
import { useBreadcrumbContext } from '@/app/(features)/_contexts/-breadcrumb-context'
import useQueryParams from '@/common/hooks/use-query-params'
import { Div, Separator } from '@/components/ui'
import { WarehouseService } from '@/services/warehouse.service'
import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute, useParams } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { getWarehouseStorageOptions } from '../_apis/warehouse-storage.api'
import { WAREHOUSE_PROVIDE_TAG } from '../_apis/warehouse.api'
import { PageProvider } from '../_contexts/-page-context'
import WarehouseStorageFormDialog from './_components/-storage-form'
import StorageListHeading from './_components/-storage-heading'
import StorageList from './_components/-storage-list'
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
	const { searchParams } = useQueryParams()

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
		queryKey: [WAREHOUSE_PROVIDE_TAG, warehouseNum],
		queryFn: () => WarehouseService.getWarehouseByNum(warehouseNum),
		select: (response) => response.metadata
	})

	return (
		<Fragment>
			<Helmet title={t('ns_common:navigation.warehouse_management')} />
			<PageProvider>
				<Div className='space-y-6'>
					<StorageListHeading />
					<Separator />
					<StorageList {...warehouseStorageQueryResult} />
				</Div>
				<WarehouseStorageFormDialog {...warehouseDetailQueryResult} />
			</PageProvider>
		</Fragment>
	)
}
