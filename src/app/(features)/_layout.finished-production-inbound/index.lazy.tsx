import HostCompatibleAlert from '@/app/(features)/_components/_shared/-host-compatible-alert'
import { useBreadcrumbContext } from '@/app/(features)/_contexts/-breadcrumb-context'
import useQuerySelector from '@/common/hooks/use-query-selector'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useFullscreen, useUpdateEffect } from 'ahooks'
import { Fragment, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import PageNavigationBlocker from './_components/-navigation-blocker'
import PageComposition from './_components/-page-composition'
import ScannedEPCsCounter from './_components/_epc-counter/-index'
import EpcListBox from './_components/_epc-data-list/-index'
import InoutboundForm from './_components/_inoutbound-form/-index'
import ScannerSettings from './_components/_scanner-settings/-index'
import ScannerToolbar from './_components/_scanner-toolbar/-index'
import { PageProvider } from './_contexts/-page-context'

export const Route = createLazyFileRoute('/(features)/_layout/finished-production-inbound/')({
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
		setBreadcrumb([{ to: '/finished-production-inbound', text: t('ns_common:navigation.fp_inoutbound') }])
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
			<title>{t('ns_common:navigation.fp_inoutbound')}</title>
			<meta name='description' content='RFID Scanner integration for inbound process' />

			<HostCompatibleAlert />
			{createPortal(
				<PageProvider>
					<PageComposition.Container
						style={{
							animationDelay: 0.25
						}}>
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
			)}
		</Fragment>
	)
}
