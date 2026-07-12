import { UserRole } from '@common/constants/enums'
import ScannedEpcCounter from '@features/finished-goods/components/finished-goods-inbound/epc-counter'
import InoutboundForm from '@features/finished-goods/components/finished-goods-inbound/inoutbound-form'
import PageComposition from '@features/finished-goods/components/finished-goods-inbound/page-composition'
import RemindMessage from '@features/finished-goods/components/finished-goods-inbound/remind-message'
import ScannerSettings from '@features/finished-goods/components/finished-goods-inbound/side-toolbar'
import { ConnectionInsight } from '@features/finished-goods/components/finished-goods-inbound/side-toolbar/connection-insight'
import { SocketProvider } from '@stores/socket.store'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import HostCompatibleGuard from '@components/guards/host-compatible-guard'
import { RoleGuard } from '@components/guards/role-guard'
import AlreadyScannedEpcsAlert from '@features/finished-goods/components/finished-goods-inbound/already-scanned-epcs-alert'
import EpcListBox from '@features/finished-goods/components/finished-goods-inbound/epc-data-list'
import ScannerToolbar from '@features/finished-goods/components/finished-goods-inbound/scanner-toolbar'
import { useBreadcrumbContext } from '../../-contexts/breadcrumb-context'
import { PageProvider } from '../../../../features/finished-goods/contexts/finished-goods-inbound/page-contenxt'

export const Route = createLazyFileRoute('/(features)/_layout/(rfid)/finished-goods-inbound/')({
	component: Page
})

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

			<RoleGuard authorizedRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.FG_WAREHOUSE_STAFF]}>
				<HostCompatibleGuard>
					<SocketProvider namespace='/rfid'>
						<PageProvider>
							<AlreadyScannedEpcsAlert />
							<PageComposition.Container>
								<PageComposition.Wrapper>
									<PageComposition.Main>
										<ScannerToolbar />
										<PageComposition.InnerWrapper>
											<PageComposition.ListBoxPanel>
												<EpcListBox />
											</PageComposition.ListBoxPanel>
											<PageComposition.CounterPanel>
												<ScannedEpcCounter />
												<ConnectionInsight />
												<RemindMessage />
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
					</SocketProvider>
				</HostCompatibleGuard>
			</RoleGuard>
		</Fragment>
	)
}
