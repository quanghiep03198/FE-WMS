import { useLayoutStore } from '@/app/(features)/_stores/-layout.store'
import { Div } from '@/components/ui'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import InOutBoundOrderList from './_components/-io-order-list'
import InoutBoundSizeRun from './_components/-io-size-run'

export const Route = createLazyFileRoute('/(features)/_layout/product-incoming-inspection/')({
	component: Page
})

function Page() {
	const { t } = useTranslation()

	// Set page breadcrumb navigation
	const setBreadcrumb = useLayoutStore((state) => state.setBreadcrumb)
	setBreadcrumb([
		{ to: '/product-incoming-inspection', text: t('ns_common:navigation.production_incoming_inspection') }
	])

	return (
		<Fragment>
			<Helmet title={t('ns_common:navigation.production_incoming_inspection')} />
			<Div className='space-y-10'>
				<InOutBoundOrderList />
				<InoutBoundSizeRun />
			</Div>
		</Fragment>
	)
}
