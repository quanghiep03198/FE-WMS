// #region Modules
import { useLayoutStore } from '@/app/(features)/_stores/-layout.store'
import useQueryParams from '@/common/hooks/use-query-params'
import { createLazyFileRoute, useParams } from '@tanstack/react-router'
import { Fragment, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { PageProvider } from '../_contexts/-page-context'
import WarehouseStorageFormDialog from './_components/-storage-form'
import StorageList from './_components/-storage-list'
// #endregion

// #region Router declaration
export const Route = createLazyFileRoute('/(features)/_layout/warehouse/_layout/storage-details/$warehouseNum/')({
	component: () => (
		<PageProvider>
			<Page />
		</PageProvider>
	)
})
// #endregion

// #region Page component
function Page() {
	const { t, i18n } = useTranslation(['ns_common'])
	const [formDialogOpenState, setFormDialogOpenState] = useState<boolean>(false)
	const { warehouseNum } = useParams({ strict: false })
	const { searchParams } = useQueryParams()

	// Set page breadcrumb navigation
	const setBreadcrumb = useLayoutStore((state) => state.setBreadcrumb)
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

			<StorageList onFormOpenChange={setFormDialogOpenState} />
			<WarehouseStorageFormDialog open={formDialogOpenState} onOpenChange={setFormDialogOpenState} />
		</Fragment>
	)
}
