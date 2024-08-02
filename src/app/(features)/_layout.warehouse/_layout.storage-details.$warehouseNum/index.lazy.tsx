// #region Modules
import { useLayoutStore } from '@/app/(features)/_stores/layout.store'
import useQueryParams from '@/common/hooks/use-query-params'
import { Div, Separator } from '@/components/ui'
import { createLazyFileRoute, useParams } from '@tanstack/react-router'
import { Fragment } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/react/shallow'
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
	const { t } = useTranslation(['ns_common'])
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

	return (
		<Fragment>
			<Helmet title={t('ns_common:navigation.warehouse_management')} />
			<PageProvider>
				<Div className='space-y-6'>
					<StorageListHeading />
					<Separator />
					<StorageList />
				</Div>
				<WarehouseStorageFormDialog />
			</PageProvider>
		</Fragment>
	)
}
