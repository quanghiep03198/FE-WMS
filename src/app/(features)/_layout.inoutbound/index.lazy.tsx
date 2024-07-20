import { useLayoutStore } from '@/app/(features)/_stores/-layout.store'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import InoutboundForm from './_components/-inoutbound-form'
import PageComposition from './_components/-page-composition'
import ScannedEPCsCounter from './_components/-scanned-epc-counter'
import ScannedEPCsList from './_components/-scanned-epc-list'
import ScanningActions from './_components/-scanning-actions'
import { PageProvider } from './_contexts/-page.context'

export const Route = createLazyFileRoute('/(features)/_layout/inoutbound/')({
	component: () => (
		<PageProvider>
			<Page />
		</PageProvider>
	)
})

function Page() {
	const { t } = useTranslation()

	// Set page breadcrumb
	const setBreadcrumb = useLayoutStore((state) => state.setBreadcrumb)
	setBreadcrumb([{ to: '/inoutbound', text: t('ns_common:navigation.inoutbound_commands') }])

	console.log('re-render')

	return (
		<Fragment>
			<Helmet title={t('ns_common:navigation.inoutbound_commands')} />
			<PageComposition.Container>
				<ScanningActions />
				<PageComposition.Main>
					{/* Scanned EPCs List */}
					<PageComposition.ListBoxPanel>
						<ScannedEPCsList />
					</PageComposition.ListBoxPanel>
					{/* Scanned EPCs counter */}
					<PageComposition.CounterPanel>
						<ScannedEPCsCounter />
					</PageComposition.CounterPanel>
					{/* In-out-bound Form */}
					<PageComposition.FormPanel>
						<InoutboundForm />
					</PageComposition.FormPanel>
				</PageComposition.Main>
			</PageComposition.Container>
		</Fragment>
	)
}
