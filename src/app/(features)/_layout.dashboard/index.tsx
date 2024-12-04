import { useBreadcrumbContext } from '@/app/(features)/_contexts/-breadcrumb-context'
import { createFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import DailyInboundReport from './_components/-daily-inbound-report'
import InoutboundOverview from './_components/-inoutbound-overview'
import TransactionOverview from './_components/-order-overview'
import Statistics from './_components/-statistics'

export const Route = createFileRoute('/(features)/_layout/dashboard/')({
	component: Page
})

function Page() {
	const { t, i18n } = useTranslation()
	const { setBreadcrumb } = useBreadcrumbContext()

	useEffect(() => {
		setBreadcrumb([{ to: '/dashboard', text: t('ns_common:navigation.dashboard') }])
	}, [i18n.language])

	return (
		<Fragment>
			<Helmet title='Warehouse Management' />

			<Container>
				<Statistics />
				<InoutboundOverview />
				<DailyInboundReport />
				<TransactionOverview />
			</Container>
		</Fragment>
	)
}

const Container = tw.div`grid grid-cols-3 gap-x-6 gap-y-10`
