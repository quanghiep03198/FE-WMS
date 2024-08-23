// #region Modules
import { useBreadcrumbContext } from '@/app/(features)/_contexts/-breadcrumb-context'
import { Div, Separator } from '@/components/ui'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import WarehouseFormDialog from './_components/-warehouse-form'
import WarehouseList from './_components/-warehouse-list'
import WarehouseListHeading from './_components/-warehouse-list-heading'
import { PageProvider } from './_contexts/-page-context'
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
			<Helmet title={t('ns_common:navigation.warehouse_management')} />
			<PageProvider>
				<Div className='space-y-6'>
					<WarehouseListHeading />
					<Separator />
					<WarehouseList />
				</Div>
				<WarehouseFormDialog />
			</PageProvider>
		</Fragment>
	)
}
