import HostCompatibleGuard from '@/components/guards/host-compatible-guard'
import IpPolicyGuard from '@/components/guards/ip-policy-guard'
import { RoleGuard } from '@/components/guards/role-guard'
import { Div, ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui'
import { UserRole } from '@common/constants/enums'
import { cn } from '@common/utils/cn'
import EpcDetailTable from '@features/defective-goods/components/defective-goods-inoutbound/epc-detail-table'
import EpcTable from '@features/defective-goods/components/defective-goods-inoutbound/epc-table'
import InoutboundController from '@features/defective-goods/components/defective-goods-inoutbound/inoutbound-controller'
import { PageContextProvider } from '@features/defective-goods/contexts/page-context'
import { useInoutboundMethod } from '@features/defective-goods/hooks/use-select-inoutbound-method'
import RfidReaderPlayground from '@features/rfid-agent/components/playground'
import { ReaderPlaygroundProvider } from '@features/rfid-agent/contexts/rfid-reader-playground.context'
import useMediaQuery from '@hooks/use-media-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { useSize } from 'ahooks'
import { Fragment, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import tw from 'tailwind-styled-components'
import { useBreadcrumbContext } from '../../-contexts/breadcrumb-context'

export const Route = createLazyFileRoute('/(features)/_layout/(defective-goods)/defective-goods-inoutbound')({
	component: RouteComponent
})

function RouteComponent() {
	const { t, i18n } = useTranslation()
	const { setBreadcrumb } = useBreadcrumbContext()
	const isSmallScreen = useMediaQuery('(max-width: 1279px)')
	const [currInoutboundMethod] = useInoutboundMethod()

	useEffect(() => {
		setBreadcrumb([{ to: '/defective-goods-inoutbound', text: t('ns_common:navigation.defective_goods_inoutbound') }])
	}, [i18n.language])

	const detailTablePanelRef = useRef<HTMLDivElement>(null)
	const rfidPlaygroundPanelRef = useRef<HTMLDivElement>(null)
	const rfidPlaygroundPanelSize = useSize(rfidPlaygroundPanelRef)
	const detailTablePanelSize = useSize(detailTablePanelRef)

	return (
		<Fragment>
			<title>{t('ns_common:navigation.defective_goods_inoutbound')}</title>
			<meta name='description' content='Defective goods inoutbound' />

			<RoleGuard authorizedRoles={[UserRole.ADMIN, UserRole.MANAGER, UserRole.DG_WAREHOUSE_STAFF]}>
				<IpPolicyGuard>
					<HostCompatibleGuard>
						<PageContextProvider>
							<Div
								style={
									{
										'--header-height': '64px',
										'--bar-height': '48px'
									} as React.CSSProperties
								}
								className={cn(
									'flex h-[var(--outlet-wrapper-height)] border-collapse flex-col divide-y divide-border rounded-md border @container',
									!isSmallScreen && 'overflow-hidden'
								)}>
								<InoutboundController />
								{currInoutboundMethod === 'manually' ? (
									<EpcTable />
								) : (
									<ResizablePanelGroup
										direction={isSmallScreen ? 'vertical' : 'horizontal'}
										className={cn('h-[calc(var(--outlet-wrapper-height)-var(--header-height))]')}
										style={
											{
												'--rfid-playground-panel-height': rfidPlaygroundPanelSize
													? rfidPlaygroundPanelSize.height + 'px'
													: '100%',
												'--detail-table-panel-height': detailTablePanelSize
													? detailTablePanelSize.height + 'px'
													: '100%'
											} as React.CSSProperties
										}>
										<ResizablePanel
											minSize={isSmallScreen ? 35 : 65}
											maxSize={isSmallScreen ? 50 : 75}
											defaultSize={isSmallScreen ? 30 : 65}>
											<PanelContent ref={detailTablePanelRef}>
												<EpcDetailTable />
											</PanelContent>
										</ResizablePanel>
										<ResizableHandle withHandle={true} className='z-30' />
										<ResizablePanel
											maxSize={isSmallScreen ? 65 : 35}
											minSize={isSmallScreen ? 50 : 25}
											defaultSize={isSmallScreen ? 65 : 30}>
											<PanelContent ref={rfidPlaygroundPanelRef}>
												<ReaderPlaygroundProvider>
													<RfidReaderPlayground
														style={
															{
																'--playground-header-height': 'var(--bar-height)',
																'--playground-actions-height': 'var(--bar-height)'
															} as React.CSSProperties
														}
													/>{' '}
												</ReaderPlaygroundProvider>
											</PanelContent>
										</ResizablePanel>
									</ResizablePanelGroup>
								)}
							</Div>
						</PageContextProvider>
					</HostCompatibleGuard>
				</IpPolicyGuard>
			</RoleGuard>
		</Fragment>
	)
}

const PanelContent = tw.div`h-full w-full place-content-stretch place-items-stretch`
