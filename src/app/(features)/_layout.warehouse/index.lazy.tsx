// #region Modules
import { useLayoutStore } from '@/app/(features)/_stores/-layout.store'
import { createLazyFileRoute } from '@tanstack/react-router'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import WarehouseList from './_components/-warehouse-list'
import { PageProvider } from './_contexts/-page-context'
// #endregion

// #region Router declaration
export const Route = createLazyFileRoute('/(features)/_layout/warehouse/')({
	component: memo(Page)
})
// #endregion

// #region Page component
function Page() {
	const { t } = useTranslation()

	// Set page breadcrumb navigation
	const setBreadcrumb = useLayoutStore((state) => state.setBreadcrumb)
	setBreadcrumb([{ to: '/warehouse', text: t('ns_common:navigation.warehouse_management') }])

	return (
		<PageProvider>
			<WarehouseList />
		</PageProvider>
	)
}
