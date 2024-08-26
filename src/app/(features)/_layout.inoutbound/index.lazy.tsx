import { useBreadcrumbContext } from '@/app/(features)/_contexts/-breadcrumb-context'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import PageComposition from './_components/-page-composition'
import ScannedEPCsCounter from './_components/_epc-counter/-index'
import EPCListBox from './_components/_epc-data-list/-index'
import InoutboundForm from './_components/_inoutbound-form/-index'
import ScanningActions from './_components/_scanning-actions/-index'
import { PageProvider } from './_contexts/-page-context'

export const Route = createLazyFileRoute('/(features)/_layout/inoutbound/')({
	component: Page
})

function Page() {
	const { t, i18n } = useTranslation()

	// Set page breadcrumb
	const { setBreadcrumb } = useBreadcrumbContext()

	useEffect(() => {
		setBreadcrumb([{ to: '/inoutbound', text: t('ns_common:navigation.inoutbound_commands') }])
	}, [i18n.language])

	return (
		<Fragment>
			<Helmet title={t('ns_common:navigation.inoutbound_commands')} />
			<PageProvider>
				<PageComposition.Container>
					<ScanningActions />
					<PageComposition.Main>
						{/* Scanned EPCs List */}
						<PageComposition.ListBoxPanel>
							<EPCListBox />
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
			</PageProvider>
		</Fragment>
	)
}
