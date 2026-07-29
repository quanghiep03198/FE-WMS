import { UserRole } from '@common/constants/enums'
import HostCompatibleGuard from '@components/guards/host-compatible-guard'
import { RoleGuard } from '@components/guards/role-guard'
import { useBreadcrumbContext } from '@contexts/breadcrumb-context'
import AlreadyScannedEpcsAlert from '@features/finished-goods/components/finished-goods-inbound/already-scanned-epcs-alert'
import ScannedEpcCounter from '@features/finished-goods/components/finished-goods-inbound/epc-counter'
import EpcListBox from '@features/finished-goods/components/finished-goods-inbound/epc-data-list'
import InoutboundForm from '@features/finished-goods/components/finished-goods-inbound/inoutbound-form'
import PageComposition from '@features/finished-goods/components/finished-goods-inbound/page-composition'
import ScannerSettings from '@features/finished-goods/components/finished-goods-inbound/side-toolbar'
import Toolbar from '@features/finished-goods/components/finished-goods-inbound/toolbar'
import { PageProvider } from '@features/finished-goods/contexts/finished-goods-inbound/page-context'
import { SocketProvider } from '@stores/socket.store'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Fragment, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

export const Route = createLazyFileRoute('/(features)/_layout/(finished-goods)/finished-goods-inbound')({
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
					<SocketProvider namespace='/finished-goods'>
						<PageProvider>
							<AlreadyScannedEpcsAlert />
							<PageComposition.Container>
								<PageComposition.Wrapper>
									<div className='hidden @[920px]/page-container:block'>
										<EpcListBox />
									</div>
									<div className='flex flex-col gap-6'>
										<Toolbar />
										<ScannedEpcCounter />
										<div className='block @[920px]/page-container:hidden'>
											<EpcListBox />
										</div>
										<InoutboundForm />
									</div>
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
