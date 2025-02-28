import { useBreadcrumbContext } from '@/app/(features)/_contexts/-breadcrumb-context'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import InoutboundOverview from './_components/-inoutbound-overview'
import Statistics from './_components/-statistics'

export const Route = createLazyFileRoute('/(features)/_layout/dashboard/')({
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
			<Helmet title={t('ns_common:navigation.dashboard')} />
			<Container>
				<Statistics />
				<InoutboundOverview />
				{/* <TransactionOverview /> */}
			</Container>
		</Fragment>
	)
}

const Container = tw.div`flex flex-col gap-y-6`
