import { useBreadcrumbContext } from '@/app/(features)/-contexts/breadcrumb-context'
import HostCompatibleGuard from '@/app/-components/-guard/host-compatible-guard'
import useQuerySelector from '@/common/hooks/use-query-selector'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useFullscreen, useUpdateEffect } from 'ahooks'
import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import ScannedEPCsCounter from './-components/-epc-counter'
import EpcListBox from './-components/-epc-data-list'
import InoutboundForm from './-components/-inoutbound-form'
import ScannerSettings from './-components/-scanner-settings'
import ScannerToolbar from './-components/-scanner-toolbar'
import PageNavigationBlocker from './-components/navigation-blocker'
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

export const DEFAULT_FP_RFID_SETTINGS: RFIDSettings = {
	pollingDuration: 1000,
	fullscreenMode: false,
	developerMode: false,
	preserveLog: false
}

function Page() {
	const { t, i18n } = useTranslation()
	const { setBreadcrumb } = useBreadcrumbContext()
	const outletWrapper = useQuerySelector('#outlet-wrapper')
	const [isFullscreen] = useFullscreen(document.body)

	useEffect(() => {
		setBreadcrumb([{ to: '/finished-goods-inbound', text: t('ns_common:navigation.finished_goods_inbound') }])
	}, [i18n.language])

	useUpdateEffect(() => {
		if (isFullscreen) {
			document.body.classList.remove('animate-in')
			document.body.classList.remove('fade-in-0')
			document.body.classList.remove('zoom-in-95')
			document.body.classList.add('animate-in')
			document.body.classList.add('fade-in-0')
			document.body.classList.add('zoom-in-95')
		}
	}, [isFullscreen])

	if (!outletWrapper) return null

	return (
		<Fragment>
			<title>{t('ns_common:navigation.finished_goods_inbound')}</title>
			<meta name='description' content='RFID Scanner integration for inbound process' />

			<HostCompatibleGuard>
				<PageProvider>
					<PageComposition.Container style={{ animationDelay: 0.25 }}>
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
					<PageNavigationBlocker />
				</PageProvider>
				{/* {createPortal(
					<PageProvider>
						<PageComposition.Container style={{ animationDelay: 0.25 }}>
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
						<PageNavigationBlocker />
					</PageProvider>,
					isFullscreen ? document.querySelector('#root') : outletWrapper
				)} */}
			</HostCompatibleGuard>
		</Fragment>
	)
}
