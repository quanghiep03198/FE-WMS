import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, lazy, Suspense } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useLayoutStore } from '../_stores/-layout.store'
const OrderDatalistDialog = lazy(() => import('./_components/-orders-datalist-dialog'))
const TransferOrdersList = lazy(() => import('./_components/-transfer-orders-list'))
const TransferOrderDetail = lazy(() => import('./_components/-transfer-order-detail'))

export const Route = createLazyFileRoute('/(features)/_layout/transfer-management/')({
	component: Page
})

function Page() {
	const { t } = useTranslation()
	const setBreadcrumb = useLayoutStore((state) => state.setBreadcrumb)
	setBreadcrumb([{ to: '/transfer-management', text: t('ns_common:navigation.transfer_managment') }])

	return (
		<Fragment>
			<Helmet title={t('ns_common:navigation.transfer_managment')} />
			<Suspense fallback={null}>
				<TransferOrdersList />
			</Suspense>
			<Suspense fallback={null}>
				<OrderDatalistDialog />
			</Suspense>
			<Suspense fallback={null}>
				<TransferOrderDetail />
			</Suspense>
		</Fragment>
	)
}
