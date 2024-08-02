import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import { useLayoutStore } from '../_stores/layout.store'
import OrderDatalistDialog from './_components/-orders-datalist-dialog'
import TransferOrderDetail from './_components/-transfer-order-detail'
import TransferOrdersList from './_components/-transfer-orders-list'

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
			<TransferOrdersList />
			<OrderDatalistDialog />
			<TransferOrderDetail />
		</Fragment>
	)
}
