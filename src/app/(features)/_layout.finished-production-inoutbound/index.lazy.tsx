import { useBreadcrumbContext } from '@/app/(features)/_contexts/-breadcrumb-context'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useTranslation } from 'react-i18next'
import PageComposition from './_components/-page-composition'
import ScannedEPCsCounter from './_components/_epc-counter/-index'
import EpcListBox from './_components/_epc-data-list/-index'
import InoutboundForm from './_components/_inoutbound-form/-index'
import ScanningToolbox from './_components/_scanner-settings/-index'
import ScannerToolbar from './_components/_scanner-toolbar/-index'
import { PageProvider } from './_contexts/-page-context'

export const Route = createLazyFileRoute('/(features)/_layout/finished-production-inoutbound/')({
	component: Page
})

export type PageEventEmitter = { action: 'get' | 'delete'; payload: string }

function Page() {
	const { t, i18n } = useTranslation()
	const { setBreadcrumb } = useBreadcrumbContext()

	useEffect(() => {
		setBreadcrumb([{ to: '/finished-production-inoutbound', text: t('ns_common:navigation.fm_inoutbound') }])
	}, [i18n.language])

	return (
		<Fragment>
			<Helmet>
				<title>{t('ns_common:navigation.fm_inoutbound')}</title>
				<meta name='description' content='RFID Scanner Integration' />
			</Helmet>
			<PageProvider>
				<PageComposition.Container>
					<PageComposition.Wrapper>
						<PageComposition.Main>
							<ScannerToolbar />
							<PageComposition.InnerWrapper>
								<PageComposition.ListBoxPanel>
									<EpcListBox />
								</PageComposition.ListBoxPanel>
								<PageComposition.CounterPanel>
									<ScannedEPCsCounter />
								</PageComposition.CounterPanel>
								<PageComposition.FormPanel>
									<InoutboundForm />
								</PageComposition.FormPanel>
							</PageComposition.InnerWrapper>
						</PageComposition.Main>
						<ScanningToolbox />
					</PageComposition.Wrapper>
				</PageComposition.Container>
			</PageProvider>
		</Fragment>
	)
}
