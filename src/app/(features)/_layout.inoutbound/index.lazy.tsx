import { useBreadcrumbContext } from '@/app/(features)/_contexts/-breadcrumb-context'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import PageComposition from './_components/-page-composition'
import ScannedEPCsCounter from './_components/_epc-counter/-index'
import EpcListBox from './_components/_epc-data-list/-index'
import InoutboundForm from './_components/_inoutbound-form/-index'
import ScanningActions from './_components/_scanning-actions/-index'
import ScanningToolbox from './_components/_scanning-toolbox/-index'
import { PageProvider } from './_contexts/-page-context'

export const Route = createLazyFileRoute('/(features)/_layout/inoutbound/')({
	component: Page
})

export type PageEventEmitter = { action: 'get' | 'delete'; payload: string }

function Page() {
	const { t, i18n } = useTranslation()

	// Set page breadcrumb
	const { setBreadcrumb } = useBreadcrumbContext()

	useEffect(() => {
		setBreadcrumb([{ to: '/inoutbound', text: t('ns_common:navigation.inoutbound_commands') }])
	}, [i18n.language])

	return (
		<Fragment>
			<Helmet>
				<title>{t('ns_common:navigation.inoutbound_commands')}</title>
				<meta name='description' content='RFID Scanner Integration' />
			</Helmet>
			<PageProvider>
				<PageComposition.Container>
					<PageComposition.Wrapper>
						<PageComposition.InnerWrapper>
							<ScanningActions />
							<PageComposition.Main>
								<PageComposition.ListBoxPanel>
									<EpcListBox />
								</PageComposition.ListBoxPanel>
								<PageComposition.CounterPanel>
									<ScannedEPCsCounter />
								</PageComposition.CounterPanel>
								<PageComposition.FormPanel>
									<InoutboundForm />
								</PageComposition.FormPanel>
							</PageComposition.Main>
						</PageComposition.InnerWrapper>
						<ScanningToolbox />
					</PageComposition.Wrapper>
				</PageComposition.Container>
			</PageProvider>
		</Fragment>
	)
}
