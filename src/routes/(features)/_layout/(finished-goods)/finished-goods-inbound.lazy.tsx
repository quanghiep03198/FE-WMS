import { UserRole } from '@common/constants/enums'
import { RoleGuard } from '@components/guards/role-guard'
import { useBreadcrumbContext } from '@contexts/breadcrumb-context'
import AlreadyScannedEpcsAlert from '@features/finished-goods/components/finished-goods-inbound/already-scanned-epcs-alert'
import ScannedEpcCounter from '@features/finished-goods/components/finished-goods-inbound/epc-counter'
import EpcListBox from '@features/finished-goods/components/finished-goods-inbound/epc-data-list'
import InoutboundForm from '@features/finished-goods/components/finished-goods-inbound/inoutbound-form'
import PageComposition from '@features/finished-goods/components/finished-goods-inbound/page-composition'
import RemindMessage from '@features/finished-goods/components/finished-goods-inbound/remind-message'
import SideToolbar from '@features/finished-goods/components/finished-goods-inbound/side-toolbar'
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
			<meta content='RFID Scanner integration for inbound process' name='description' />

			<RoleGuard authorizedRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.FG_WAREHOUSE_STAFF]}>
				<SocketProvider namespace='/finished-goods'>
					<PageProvider>
						<AlreadyScannedEpcsAlert />
						<PageComposition.Container>
							<PageComposition.Wrapper>
								<div className='order-3 @[920px]/page-container:order-none'>
									<EpcListBox />
								</div>
								<div className='contents @[920px]/page-container:flex @[920px]/page-container:flex-col @[920px]/page-container:gap-6'>
									<div className='order-1'>
										<Toolbar />
									</div>
									<div className='order-2'>
										<ScannedEpcCounter />
									</div>
									<div className='order-4'>
										<RemindMessage />
									</div>
									<div className='order-5'>
										<InoutboundForm />
									</div>
								</div>
								<div className='order-last @[920px]/page-container:order-none'>
									<SideToolbar />
								</div>
							</PageComposition.Wrapper>
						</PageComposition.Container>
					</PageProvider>
				</SocketProvider>
			</RoleGuard>
		</Fragment>
	)
}
