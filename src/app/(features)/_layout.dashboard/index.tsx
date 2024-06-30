import { useBreadcrumb } from '@/app/(features)/_hooks/-use-breadcrumb'
import { Div } from '@/components/ui'
import { createFileRoute } from '@tanstack/react-router'
import { Fragment } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import InoutboundOverview from './_components/-inoutbound-overview'
import Statistics from './_components/-statistics'
import TransactionHistory from './_components/-orders-history'
import PageComposition from './_components/-page-composition'
import TransactionOverview from './_components/-order-overview'

export const Route = createFileRoute('/(features)/_layout/dashboard/')({
	component: Page
})

function Page() {
	const { t } = useTranslation()
	useBreadcrumb([{ to: '/dashboard', text: t('ns_common:navigation.dashboard') }])

	return (
		<Fragment>
			<Helmet title='Warehouse Management' />

			<PageComposition.Container>
				<Statistics />
				<InoutboundOverview />
				<TransactionHistory />
				<TransactionOverview />
			</PageComposition.Container>
		</Fragment>
	)
}
