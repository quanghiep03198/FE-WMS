import { useBreadcrumb } from '@/app/(features)/_hooks/-use-breadcrumb'
import { createFileRoute } from '@tanstack/react-router'
import { Fragment } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import InoutboundOverview from './_components/-inoutbound-overview'
import TransactionOverview from './_components/-order-overview'
import TransactionHistory from './_components/-orders-history'
import Statistics from './_components/-statistics'

export const Route = createFileRoute('/(features)/_layout/dashboard/')({
	component: Page
})

function Page() {
	const { t } = useTranslation()
	useBreadcrumb([{ to: '/dashboard', text: t('ns_common:navigation.dashboard') }])

	return (
		<Fragment>
			<Helmet title='Warehouse Management' />

			<Container>
				<Statistics />
				<InoutboundOverview />
				<TransactionHistory />
				<TransactionOverview />
			</Container>
		</Fragment>
	)
}

const Container = tw.div`grid grid-cols-3 gap-x-6 gap-y-10`
