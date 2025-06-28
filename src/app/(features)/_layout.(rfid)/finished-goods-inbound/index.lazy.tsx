import { useBreadcrumbContext } from '@/app/(features)/-contexts/breadcrumb-context'
import HostCompatibleGuard from '@/app/-components/-guard/host-compatible-guard'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import ScannedEPCsCounter from './-components/-epc-counter'
import EpcListBox from './-components/-epc-data-list'
import InoutboundForm from './-components/-inoutbound-form'
import ScannerSettings from './-components/-scanner-settings'
import ScannerToolbar from './-components/-scanner-toolbar'
import PageComposition from './-components/page-composition'
import { PageProvider } from './-contexts/page-context'

export const Route = createLazyFileRoute('/(features)/_layout/(rfid)/finished-goods-inbound/')({
	component: Page
})

export type PageEventEmitter = { action: 'get' | 'delete'; payload: string }

export type RFIDSettings = {
	pollingDuration: number
	fullscreenMode: boolean
	developerMode: boolean
	preserveLog: boolean
}

function Page() {
	const { t, i18n } = useTranslation()
	const { setBreadcrumb } = useBreadcrumbContext()

	useEffect(() => {
		setBreadcrumb([{ to: '/finished-goods-inbound', text: t('ns_common:navigation.finished_goods_inbound') }])
	}, [i18n.language])

	return (
		<Fragment>
			<title>{t('ns_common:navigation.finished_goods_inbound')}</title>
			<meta name='description' content='RFID Scanner integration for inbound process' />

			<HostCompatibleGuard>
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
							<ScannerSettings />
						</PageComposition.Wrapper>
					</PageComposition.Container>
					{/* Temporarily disable navigation blocker because of potential preventing update service worker  */}
					{/* <PageNavigationBlocker /> */}
				</PageProvider>
			</HostCompatibleGuard>
		</Fragment>
	)
}
