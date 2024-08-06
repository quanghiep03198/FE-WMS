// #region Modules
import { useLayoutStore } from '@/app/(features)/_stores/layout.store'
import useQueryParams from '@/common/hooks/use-query-params'
import { IWarehouseStorage } from '@/common/types/entities'
import { Div, Separator } from '@/components/ui'
import { WarehouseService } from '@/services/warehouse.service'
import { useQuery } from '@tanstack/react-query'
import { createLazyFileRoute, useParams } from '@tanstack/react-router'
import { format } from 'date-fns'
import { Fragment, useCallback } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/react/shallow'
import { getWarehouseStorageOptions } from '../_apis/warehouse-storage.api'
import { WAREHOUSE_PROVIDE_TAG } from '../_apis/warehouse.api'
import { warehouseStorageTypes } from '../_constants/warehouse.const'
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
	const setBreadcrumb = useLayoutStore(useShallow((state) => state.setBreadcrumb))

	setBreadcrumb([
		{
			text: t('ns_common:navigation.warehouse_management'),
			to: '/warehouse'
		},
		{
			text: t('ns_common:navigation.storage_detail'),
			to: '/warehouse/storage-details/$warehouseNum',
			params: { warehouseNum },
			search: searchParams
		},
		{
			text: warehouseNum,
			to: '/warehouse/storage-details/$warehouseNum',
			params: { warehouseNum },
			search: searchParams
		}
	])

	const transformResponse = useCallback(
		(response: ResponseBody<IWarehouseStorage[]>) => {
			const { metadata } = response
			return Array.isArray(metadata)
				? metadata.map((item) => ({
						...item,
						created: format(item.created, 'yyyy-MM-dd'),
						type_storage: t(warehouseStorageTypes[item.type_storage], {
							ns: 'ns_warehouse',
							defaultValue: item.type_storage
						})
					}))
				: []
		},
		[i18n.language]
	)
	const warehouseStorageQueryResult = useQuery(getWarehouseStorageOptions(warehouseNum, { select: transformResponse }))
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
